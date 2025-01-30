import { PublicKey, Transaction, SystemProgram, Connection, sendAndConfirmTransaction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as crypto from "crypto";
import * as solanaNetwork from "../common/solanaNetwork";
import BN from "bn.js";
import IDL from "../common/idl.json";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Turnkey } from "@turnkey/sdk-server";
import ENV_CONFIG from "../config/env";
import { TurnkeySigner } from "@turnkey/solana";
import { TurnkeyActivityError } from "@turnkey/http";
import { TokenService } from "../services/tokenServices";
import { getOwnerWalletAddress, solToLamports } from "../scrapeTwitter/utils";
import { FarcasterAccountService } from "../services/farcasterAccountService";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

const { Program } = anchor;

const turnkeyClient = new Turnkey({
    apiBaseUrl: ENV_CONFIG.TURNKEY_BASE_URL!,
    apiPublicKey: ENV_CONFIG.TURNKEY_API_PUBLIC_KEY!,
    apiPrivateKey: ENV_CONFIG.TURNKEY_API_PRIVATE_KEY!,
    defaultOrganizationId: ENV_CONFIG.TURNKEY_ORGANIZATION_ID,
    activityPoller: {
        intervalMs: 5_000,
        numRetries: 3,
    },
});

const organizationId = ENV_CONFIG.TURNKEY_ORGANIZATION_ID;
const turnkeySigner = new TurnkeySigner({
    organizationId,
    client: turnkeyClient.apiClient(),
});
const turnkeyClientRef = turnkeyClient.apiClient();

export async function createWallet() {
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

        console.log(
            [
                `New Solana wallet created!`,
                `- Name: ${walletName}`,
                `- Wallet ID: ${walletId}`,
                `- Solana address: ${address}`,
            ].join("\n")
        );
        return { walletName, walletId, walletAddress: address };
    } catch (error) {
        if (error instanceof TurnkeyActivityError) {
            throw error;
        }

        throw new TurnkeyActivityError({
            message: `Failed to create a new Solana wallet: ${
                (error as Error).message
            }`,
            cause: error as Error,
        });
    }
}

const program = new Program(IDL as any, turnkeySigner as any) as any;
const connection = solanaNetwork.connect();
// const solAddress = "Ad75LBmPLWphWV34fQumh64Bxq9wCaYx7c2FKigBiNwW";

export async function createToken({ solAddress }: { solAddress: string }) {
    const fromKey = new PublicKey(solAddress);
    const seed = new BN(Date.now().toString());

    const [mint] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), seed.toArrayLike(Buffer, "le", 8)],
        program.programId
    );

    const [listing] = PublicKey.findProgramAddressSync(
        [Buffer.from("listing"), seed.toArrayLike(Buffer, "le", 8)],
        program.programId
    );

    const mintVault = getAssociatedTokenAddressSync(
        mint,
        listing,
        true,
        TOKEN_PROGRAM_ID
    );

    const [solVault] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), seed.toArrayLike(Buffer, "be", 8)],
        program.programId
    );

    const transferTx = new Transaction().add(
        await program.methods
            .createListing(seed, "MyListing1892")
            .accounts({
                signer: new PublicKey(solAddress),
                mint,
                listing,
                mintVault,
                solVault,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .instruction()
    );

    transferTx.recentBlockhash = await solanaNetwork.recentBlockhash();
    transferTx.feePayer = fromKey;

    await turnkeySigner.addSignature(transferTx, solAddress);
    const txHash = await solanaNetwork.broadcast(connection, transferTx);
    return { txHash, mint, listing, mintVault, solVault, seed };
}

export async function buyToken({ agentFid, ownerFid, amount }) {
    const farcasterAccountService = new FarcasterAccountService();
    const farcasterAccountData = await farcasterAccountService.findFarcasterAccountByFid(agentFid);
    const {ownerWalletAddress} = await getOwnerWalletAddress({fid: ownerFid});
    const buyerPublicKey = new PublicKey(ownerWalletAddress);
    if (!farcasterAccountData?.pk) {
        throw new Error("Account not found");
    }
    const tokenService = new TokenService();
    const agentToken = await tokenService.getTokenByFarcasterAccountId(
        farcasterAccountData?.pk as any
    );
    const { mint, listing, mint_vault, sol_vault } = agentToken;
    const userAta = getAssociatedTokenAddressSync(
        new PublicKey(mint),
        buyerPublicKey,
        false,
        TOKEN_PROGRAM_ID
    );

    const transferTx = new Transaction().add(
        await program.methods
            .buy(new BN(solToLamports(Number(amount))))
            .accounts({
                user: buyerPublicKey,
                mint: new PublicKey(mint),
                listing: new PublicKey(listing),
                mintVault: new PublicKey(mint_vault),
                solVault: new PublicKey(sol_vault),
                userAta,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .instruction()
    );

    transferTx.recentBlockhash = await solanaNetwork.recentBlockhash();
    transferTx.feePayer = buyerPublicKey;

    await turnkeySigner.addSignature(transferTx, ownerWalletAddress);
    const txHash = await solanaNetwork.broadcast(connection, transferTx);
    console.log("buyToken--txhash---", txHash);
    return txHash;
}

export async function sellToken({ agentFid, ownerFid, amount }) {
    const farcasterAccountService = new FarcasterAccountService();
    const farcasterAccountData = await farcasterAccountService.findFarcasterAccountByFid(agentFid);
    const {ownerWalletAddress} = await getOwnerWalletAddress({fid: ownerFid});
    const sellerPublicKey = new PublicKey(ownerWalletAddress);
    if (!farcasterAccountData?.pk) {
        throw new Error("Account not found");
    }
    const tokenService = new TokenService();
    const agentToken = await tokenService.getTokenByFarcasterAccountId(
        farcasterAccountData?.pk as any
    );
    const { mint, listing, mint_vault, sol_vault } = agentToken;

    const userAta = getAssociatedTokenAddressSync(
        new PublicKey(mint),
        sellerPublicKey,
        false,
        TOKEN_PROGRAM_ID
    );

    const transferTx = new Transaction().add(
        await program.methods
            .sell(new BN(solToLamports(Number(amount))))
            .accounts({
                user: sellerPublicKey,
                mint: new PublicKey(mint),
                listing: new PublicKey(listing),
                mintVault: new PublicKey(mint_vault),
                solVault: new PublicKey(sol_vault),
                userAta,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .instruction()
    );

    transferTx.recentBlockhash = await solanaNetwork.recentBlockhash();
    transferTx.feePayer = sellerPublicKey;

    await turnkeySigner.addSignature(transferTx, ownerWalletAddress);
    const txHash = await solanaNetwork.broadcast(connection, transferTx);
    console.log("sellToken--txhash---", txHash);
}

export async function burnToken({ agentFid, ownerFid, amount }){
    const farcasterAccountService = new FarcasterAccountService();
    const farcasterAccountData = await farcasterAccountService.findFarcasterAccountByFid(agentFid);
    const {ownerWalletAddress} = await getOwnerWalletAddress({fid: ownerFid});
    const ownerPublicKey = new PublicKey(ownerWalletAddress);
    if (!farcasterAccountData?.pk) {
        throw new Error("Account not found");
    }
    const tokenService = new TokenService();
    const agentToken = await tokenService.getTokenByFarcasterAccountId(
        farcasterAccountData?.pk as any
    );
    const { mint, listing, mint_vault, sol_vault } = agentToken;

    const userAta = getAssociatedTokenAddressSync(
        new PublicKey(mint),
        ownerPublicKey,
        false,
        TOKEN_PROGRAM_ID
    );

    const transferTx = new Transaction().add(
        await program.methods
            .burn(new BN(solToLamports(Number(amount))))
            .accounts({
                user: ownerPublicKey,
                mint: new PublicKey(mint),
                listing: new PublicKey(listing),
                mintVault: new PublicKey(mint_vault),
                solVault: new PublicKey(sol_vault),
                userAta,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .instruction()
    );

    transferTx.recentBlockhash = await solanaNetwork.recentBlockhash();
    transferTx.feePayer = ownerPublicKey;

    await turnkeySigner.addSignature(transferTx, ownerWalletAddress);
    const txHash = await solanaNetwork.broadcast(connection, transferTx);
    console.log("burnToken--txhash---", txHash);
}

export async function updateTokenMetadata() {

    const mintAuthority = '3croVPLo7CoQCMvo8GjtGfHGTUggCiMth5Lh6ki7W4oG'
    const user = '5ond8osS9gjV1hmt1kaj4UNCzc5TGzkwiR37ifG1rrgn'
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    
    // Substitute in your token mint account
    const tokenMintAccount = new PublicKey("3croVPLo7CoQCMvo8GjtGfHGTUggCiMth5Lh6ki7W4oG");
    
    // Define the new metadata for the token
    const newMetadataData = {
        name: "ATest Tokens", // New name
        symbol: "AAAAGT",          // New symbol
        uri: "https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json",
        sellerFeeBasisPoints: 500,  // Seller fee in basis points (5%)
        creators: null,
        collection: null,
        uses: null,
    };
    
    // Find the Metadata PDA
    const metadataPDAAndBump = PublicKey.findProgramAddressSync(
        [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        tokenMintAccount.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );
    
    const metadataPDA = metadataPDAAndBump[0];
    
    console.log('metadataPDA---->', metadataPDA)

    const transaction = new Transaction();
    const mintPublicKey = new PublicKey(mintAuthority)
    const publicKey  = new PublicKey(user)
    // Create the Update Metadata Instruction
    const updateMetadataAccountInstruction =
        createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataPDA,
            mint: tokenMintAccount,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                collectionDetails: null,
                data: newMetadataData,
                isMutable: true,
            },
        }
        );
    
        transaction.add(updateMetadataAccountInstruction);

        transaction.feePayer = new PublicKey(user);
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // Sign and send transaction
        await turnkeySigner.addSignature(transaction, user);
        const txHash = await solanaNetwork.broadcast(connection, transaction);

        console.log("Transaction Hash:", txHash);
        return txHash;
}

export async function transferSol({senderWalletAddress, recipientWalletAddress, amount}) {
    const { blockhash } = await connection.getLatestBlockhash();
    const senderPublicKey = new PublicKey(senderWalletAddress);
    const recipientPublicKey = new PublicKey(recipientWalletAddress);

    // Create a transaction
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;

    // Add instruction to transfer SOL
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: senderPublicKey,
            toPubkey: recipientPublicKey,
            lamports: solToLamports(amount),
        })
    );

    // Sign and send the transaction using the wallet
    await turnkeySigner.addSignature(transaction, senderWalletAddress);

    // Confirm the transaction
    const txHash = await solanaNetwork.broadcast(connection, transaction);
    console.log("transferSol--txhash---", txHash);
}

