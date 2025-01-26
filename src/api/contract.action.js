"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = createWallet;
exports.createToken = createToken;
exports.buyToken = buyToken;
exports.sellToken = sellToken;
exports.transferSol = transferSol;
const web3_js_1 = require("@solana/web3.js");
const anchor = __importStar(require("@coral-xyz/anchor"));
const crypto = __importStar(require("crypto"));
const solanaNetwork = __importStar(require("../common/solanaNetwork"));
const bn_js_1 = __importDefault(require("bn.js"));
const idl_json_1 = __importDefault(require("../common/idl.json"));
const spl_token_1 = require("@solana/spl-token");
const sdk_server_1 = require("@turnkey/sdk-server");
const env_1 = __importDefault(require("../config/env"));
const solana_1 = require("@turnkey/solana");
const http_1 = require("@turnkey/http");
const tokenServices_1 = require("../services/tokenServices");
const utils_1 = require("../scrapeTwitter/utils");
const farcasterAccountService_1 = __importDefault(require("../services/farcasterAccountService"));
const { Program } = anchor;
const turnkeyClient = new sdk_server_1.Turnkey({
    apiBaseUrl: env_1.default.TURNKEY_BASE_URL,
    apiPublicKey: env_1.default.TURNKEY_API_PUBLIC_KEY,
    apiPrivateKey: env_1.default.TURNKEY_API_PRIVATE_KEY,
    defaultOrganizationId: env_1.default.TURNKEY_ORGANIZATION_ID,
    activityPoller: {
        intervalMs: 5000,
        numRetries: 3,
    },
});
const organizationId = env_1.default.TURNKEY_ORGANIZATION_ID;
const turnkeySigner = new solana_1.TurnkeySigner({
    organizationId,
    client: turnkeyClient.apiClient(),
});
const turnkeyClientRef = turnkeyClient.apiClient();
async function createWallet() {
    const walletName = `Solana Wallet ${crypto.randomBytes(2).toString("hex")}`;
    try {
        const response = await turnkeyClientRef.createWallet({
            walletName,
            accounts: [
                {
                    pathFormat: "PATH_FORMAT_BIP32",
                    path: "m/44'/501'/0'/0'",
                    curve: "CURVE_ED25519",
                    addressFormat: "ADDRESS_FORMAT_SOLANA",
                },
            ],
        });
        const walletId = response.walletId;
        if (!walletId) {
            console.error("response doesn't contain a valid wallet ID");
            process.exit(1);
        }
        const address = response.addresses[0];
        if (!address) {
            console.error("response doesn't contain a valid address");
            process.exit(1);
        }
        console.log([
            `New Solana wallet created!`,
            `- Name: ${walletName}`,
            `- Wallet ID: ${walletId}`,
            `- Solana address: ${address}`,
        ].join("\n"));
        return { walletName, walletId, walletAddress: address };
    }
    catch (error) {
        if (error instanceof http_1.TurnkeyActivityError) {
            throw error;
        }
        throw new http_1.TurnkeyActivityError({
            message: `Failed to create a new Solana wallet: ${error.message}`,
            cause: error,
        });
    }
}
const program = new Program(idl_json_1.default, turnkeySigner);
const connection = solanaNetwork.connect();
// const solAddress = "Ad75LBmPLWphWV34fQumh64Bxq9wCaYx7c2FKigBiNwW";
async function createToken({ solAddress }) {
    const fromKey = new web3_js_1.PublicKey(solAddress);
    const seed = new bn_js_1.default(Date.now().toString());
    const [mint] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("mint"), seed.toArrayLike(Buffer, "le", 8)], program.programId);
    const [listing] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("listing"), seed.toArrayLike(Buffer, "le", 8)], program.programId);
    const mintVault = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, listing, true, spl_token_1.TOKEN_PROGRAM_ID);
    const [solVault] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault"), seed.toArrayLike(Buffer, "be", 8)], program.programId);
    const transferTx = new web3_js_1.Transaction().add(await program.methods
        .createListing(seed, "MyListing1892")
        .accounts({
        signer: new web3_js_1.PublicKey(solAddress),
        mint,
        listing,
        mintVault,
        solVault,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .instruction());
    transferTx.recentBlockhash = await solanaNetwork.recentBlockhash();
    transferTx.feePayer = fromKey;
    await turnkeySigner.addSignature(transferTx, solAddress);
    const txHash = await solanaNetwork.broadcast(connection, transferTx);
    return { txHash, mint, listing, mintVault, solVault, seed };
}
async function buyToken({ agentFid, ownerFid, amount }) {
    const farcasterAccountService = new farcasterAccountService_1.default();
    const farcasterAccountData = await farcasterAccountService.findFarcasterAccountByFid(agentFid);
    const { ownerWalletAddress } = await (0, utils_1.getOwnerWalletAddress)({ fid: ownerFid });
    const buyerPublicKey = new web3_js_1.PublicKey(ownerWalletAddress);
    if (!farcasterAccountData?.pk) {
        throw new Error("Account not found");
    }
    const tokenService = new tokenServices_1.TokenService();
    const agentToken = await tokenService.getTokenByFarcasterAccountId(farcasterAccountData?.pk);
    const { mint, listing, mint_vault, sol_vault } = agentToken;
    const userAta = (0, spl_token_1.getAssociatedTokenAddressSync)(new web3_js_1.PublicKey(mint), buyerPublicKey, false, spl_token_1.TOKEN_PROGRAM_ID);
    const transferTx = new web3_js_1.Transaction().add(await program.methods
        .buy(new bn_js_1.default((0, utils_1.solToLamports)(Number(amount))))
        .accounts({
        user: buyerPublicKey,
        mint: new web3_js_1.PublicKey(mint),
        listing: new web3_js_1.PublicKey(listing),
        mintVault: new web3_js_1.PublicKey(mint_vault),
        solVault: new web3_js_1.PublicKey(sol_vault),
        userAta,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .instruction());
    transferTx.recentBlockhash = await solanaNetwork.recentBlockhash();
    transferTx.feePayer = buyerPublicKey;
    await turnkeySigner.addSignature(transferTx, ownerWalletAddress);
    const txHash = await solanaNetwork.broadcast(connection, transferTx);
    console.log("buyToken--txhash---", txHash);
}
async function sellToken({ agentFid, ownerFid, amount }) {
    const farcasterAccountService = new farcasterAccountService_1.default();
    const farcasterAccountData = await farcasterAccountService.findFarcasterAccountByFid(agentFid);
    const { ownerWalletAddress } = await (0, utils_1.getOwnerWalletAddress)({ fid: ownerFid });
    const sellerPublicKey = new web3_js_1.PublicKey(ownerWalletAddress);
    if (!farcasterAccountData?.pk) {
        throw new Error("Account not found");
    }
    const tokenService = new tokenServices_1.TokenService();
    const agentToken = await tokenService.getTokenByFarcasterAccountId(farcasterAccountData?.pk);
    const { mint, listing, mint_vault, sol_vault } = agentToken;
    const userAta = (0, spl_token_1.getAssociatedTokenAddressSync)(new web3_js_1.PublicKey(mint), sellerPublicKey, false, spl_token_1.TOKEN_PROGRAM_ID);
    const transferTx = new web3_js_1.Transaction().add(await program.methods
        .sell(new bn_js_1.default((0, utils_1.solToLamports)(Number(amount))))
        .accounts({
        user: sellerPublicKey,
        mint: new web3_js_1.PublicKey(mint),
        listing: new web3_js_1.PublicKey(listing),
        mintVault: new web3_js_1.PublicKey(mint_vault),
        solVault: new web3_js_1.PublicKey(sol_vault),
        userAta,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .instruction());
    transferTx.recentBlockhash = await solanaNetwork.recentBlockhash();
    transferTx.feePayer = sellerPublicKey;
    await turnkeySigner.addSignature(transferTx, ownerWalletAddress);
    const txHash = await solanaNetwork.broadcast(connection, transferTx);
    console.log("sellToken--txhash---", txHash);
}
async function transferSol({ senderWalletAddress, recipientWalletAddress, amount }) {
    const { blockhash } = await connection.getLatestBlockhash();
    const senderPublicKey = new web3_js_1.PublicKey(senderWalletAddress);
    const recipientPublicKey = new web3_js_1.PublicKey(recipientWalletAddress);
    // Create a transaction
    const transaction = new web3_js_1.Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;
    // Add instruction to transfer SOL
    transaction.add(web3_js_1.SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: recipientPublicKey,
        lamports: (0, utils_1.solToLamports)(amount),
    }));
    // Sign and send the transaction using the wallet
    await turnkeySigner.addSignature(transaction, senderWalletAddress);
    // Confirm the transaction
    const txHash = await solanaNetwork.broadcast(connection, transaction);
    console.log("transferSol--txhash---", txHash);
}
