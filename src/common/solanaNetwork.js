"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
exports.balance = balance;
exports.dropTokens = dropTokens;
exports.broadcast = broadcast;
exports.recentBlockhash = recentBlockhash;
exports.getConfirmationStrategy = getConfirmationStrategy;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
function connect(endpoint) {
    if (endpoint === undefined) {
        endpoint = "https://api.devnet.solana.com";
    }
    return new web3_js_1.Connection(endpoint, "confirmed");
}
async function balance(connection, address) {
    const publicKey = new web3_js_1.PublicKey(address);
    return await connection.getBalance(publicKey);
}
async function dropTokens(connection, solanaAddress) {
    const publicKey = new web3_js_1.PublicKey(solanaAddress);
    console.log(`Dropping 1 SOL into ${solanaAddress}...`);
    const airdropSignature = await connection.requestAirdrop(publicKey, web3_js_1.LAMPORTS_PER_SOL);
    const confirmationStrategy = await getConfirmationStrategy(airdropSignature);
    await connection.confirmTransaction(confirmationStrategy);
    console.log("\nSuccess! ✅", `Explorer link: https://explorer.solana.com/address/${solanaAddress}?cluster=devnet`);
}
async function broadcast(connection, signedTransaction) {
    const signature = "version" in signedTransaction
        ? signedTransaction.signatures[0]
        : signedTransaction.signature;
    const confirmationStrategy = await getConfirmationStrategy(bs58_1.default.encode(signature));
    const transactionHash = await (0, web3_js_1.sendAndConfirmRawTransaction)(connection, Buffer.from(signedTransaction.serialize()), confirmationStrategy, { commitment: "confirmed" });
    console.log("Transaction broadcast and confirmed! 🎉", `https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`);
    return transactionHash;
}
async function recentBlockhash() {
    const connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
    const blockhash = await connection.getLatestBlockhash();
    return blockhash.blockhash;
}
async function getConfirmationStrategy(signature) {
    const connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
    const latestBlockHash = await connection.getLatestBlockhash();
    return {
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature,
    };
}
