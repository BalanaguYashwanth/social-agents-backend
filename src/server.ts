// @ts-nocheck
import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./config/db"; // TypeORM DataSource
import {
    buyAndBurnToken,
    fetchRedisCacheData,
    getOwnerWalletAddress,
    hasUserExists,
    runPipelineInWorker,
    solToLamports,
} from "./scrapeTwitter/utils";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Router, Request, Response } from "express";
import { OWNER_TYPE } from "./config/constantTypes";
import { TokenService } from "./services/tokenServices";
import {
    burnToken,
    buyToken,
    createToken,
    createWallet,
    sellToken,
    transferSol,
} from "./api/contract.action";
import createAndSaveFarcasterAccountAndWallet from "./createFarcaster/createFarcasterAccount";
import {
    fetchAgentDetails,
    getUserByFid,
    getWalletByOwnerId,
    saveToken,
    saveUser,
    saveWallet,
    updateWalletBalanace,
} from "./dbHandler";
import { checkAvailableFid, getRandomFid } from "./api/farcaster.action";
import { FarcasterAccountService } from "./services/farcasterAccountService";
import ENV_CONFIG from "./config/env";
import { createClient } from 'redis';

const redisClient = createClient({
    username: ENV_CONFIG.REDIS_USERNAME,
    password: ENV_CONFIG.REDIS_PASSWORD,
    socket: {
        host: ENV_CONFIG.REDIS_HOST,
        port: ENV_CONFIG.REDIS_PORT
    }
});
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();

const startServer = async () => {
    try {
    // Initialize the database
    await AppDataSource.initialize();
    console.log("Data source has been initialized!");

    // Set up Express app
    const app = express();
    app.use(cors({
        origin: "*", // Change this to a specific domain if needed
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true // If using cookies or authentication headers
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Routes
    app.get("/", (req, res) => res.send("Welcome, this is the REST API!"));
    app.get("/hello", (req, res) => res.json({ message: "Hello World!" }));


    const createAndSaveWallet = async ({ownerFk, ownerType}: {ownerFk: bigint, ownerType: OWNER_TYPE}) => {
        const { walletName, walletId, walletAddress } = await createWallet();
        await saveWallet({  ownerFk, ownerType, walletName, walletId, walletAddress });
        return {walletName, walletId, walletAddress};
    }


    const loadBalanceIntoWallet = async ({senderWalletAddress, recipientWalletAddress, amount}: {recipientWalletAddress: string, senderWalletAddress: string, amount: number}) => {
        await transferSol({senderWalletAddress, recipientWalletAddress, amount});
    }

    app.get("/wallet/:id", async (req: Request, res: Response) => {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ error: "Fid is required" });
        }

        const id = Number(req.params.id);
        const user = await getUserByFid(id);
        console.log(user);

        if (!user?.pk) {
            return res.status(404).json({ error: "User not found" });
        }

        const wallet = await getWalletByOwnerId({ownerFk: user.pk, ownerType: OWNER_TYPE.USER});
        res.json({ walletAddress: wallet?.wallet_address });
    });

    app.post("/launch-agent", async (req, res) => {
        try {
            const { username, name, language, twitterUsername: unOrganizedTwitterUsername, ownerFid } = req.body;
            const twitterUsername = unOrganizedTwitterUsername?.toLowerCase();
            const {ownerWalletAddress, userPk} = await getOwnerWalletAddress({fid: ownerFid});
            const lowerUsername = username?.toLowerCase();
            // const signer_uuid = '1234567890';
            // const fid = 194
            const fid = await getRandomFid();
            const isNameAvailable = await checkAvailableFid(lowerUsername);
            if (!isNameAvailable) {
                return res.status(400).json({ error: "Name not available" });
            }
            if (!lowerUsername || !name || !language || !twitterUsername) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }
            const { signer_uuid, agentId } = await createAndSaveFarcasterAccountAndWallet({
                    FID: fid,
                    username: lowerUsername,
                    name,
                    user_fk: BigInt(userPk)
                }) as any;
            const wallet = await createAndSaveWallet({ownerFk: BigInt(agentId), ownerType: OWNER_TYPE.FARCASER_ACCOUNT});
            await loadBalanceIntoWallet({senderWalletAddress: ownerWalletAddress, recipientWalletAddress: wallet.walletAddress, amount: 0.1});
            const { txHash, mint, listing, mintVault, solVault, seed } =
                await createToken({ solAddress: wallet.walletAddress });
            await saveToken({
                farcasterAccountFk: BigInt(agentId),
                txHash,
                mint,
                listing,
                mintVault,
                solVault,
                seed,
                walletAddress: wallet.walletAddress,
            });
            runPipelineInWorker({
                username: lowerUsername,
                name,
                language,
                twitterUsername,
                signerUuid: signer_uuid,
                fid,
            });
            res.json({
                message:
                    "Agent launched successfully, Wait for few minutes to complete the process",
            });
        } catch (error) {
            console.error("Error: ", error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    });

    const userCached = async (req, res, next) => {
        const {fid, username} = req.body;
        const data = await redisClient.get(String(fid));
        if(data){
            const parsedData = JSON.parse(data)
            return res.status(200).json({ status: "already exists", walletAddress: parsedData?.walletAddress})
        }
        next()
    }

    app.post("/create-user", userCached, async (req, res) => {
        try {
            const { fid, username } = req.body;
            const hasUser = await hasUserExists(fid)
            if (hasUser) {
                const user = await getUserByFid(fid);
                if (!user?.pk) {
                    return res.status(404).json({ error: "User not found" });
                }
                const wallet = await getWalletByOwnerId({ownerFk: user.pk, ownerType: OWNER_TYPE.USER});
                await redisClient.set(String(fid), JSON.stringify({walletAddress: wallet?.wallet_address}))
                return res.status(200).json({ status: "already exists", walletAddress: wallet?.wallet_address});
            }
            const { walletName, walletId, walletAddress } = await createWallet();
            const user = await saveUser({ fid, username });
            await saveWallet({ ownerFk: user.pk, ownerType: OWNER_TYPE.USER, walletName, walletId, walletAddress });
            return res.status(200).json({ status: "created", walletAddress });
        } catch (error: any) {
            return res
                .status(400)
                .json({ error: error.message || "something went wrong" });
        }
    });

    app.post("/sell-token", async (req, res) => {
        const { agentFid, ownerFid, amount } = req.body;
        await sellToken({ agentFid, ownerFid, amount });
        return res.status(200).json({ message: "Token sold successfully" });
    });

    app.post("/burn-token", async (req, res) => {
        const { agentFid, ownerFid, amount } = req.body;
        await burnToken({ agentFid, ownerFid, amount });
        return res.status(200).json({ message: "Token burn successfully" });
    });

    app.post("/buy-token", async (req, res) => {
        const { agentFid, ownerFid, amount } = req.body;
        if(!(ownerFid && agentFid && amount)){
            return res.status(400).json({ message: "Please send proper inputs" });
        }
        await buyToken({ agentFid, ownerFid, amount });
        return res.status(200).json({ message: "Token bought successfully" });
    });

    app.post("/create-token", async (req, res) => {
        const { listing, mint, mint_vault, sol_vault, seed, user_ata } =
            req.body;
        const tokenService = new TokenService();
        const token = await tokenService.createToken({
            listing,
            mint,
            mint_vault,
            sol_vault,
            seed,
            user_ata,
        });
        return res.status(200).json({ token });
    });

    app.post('/update-wallet-balance', async(req, res)=>{
        const {walletAddress, amount} = req.body
        await updateWalletBalanace({walletAddress, amount})
        return res.status(200).json({ status:'updated' });
    })

    app.post('/cache/update-tx', async (req, res) => {
        const { walletAddress, amount } = req.body;
        const existingData = await redisClient.get(walletAddress);
        let parsedData
        if (existingData) {
            parsedData = JSON.parse(existingData);
            parsedData.amount = parseFloat(amount);
            await redisClient.set(walletAddress, JSON.stringify(parsedData));
        } else {
            parsedData = { walletAddress, amount }
            await redisClient.set(walletAddress, JSON.stringify(parsedData));
        }
        res.json({ status: "Wallet updated successfully", data: {...parsedData} });
    });

    app.post('/cache/decrease-balance', async (req, res) => {
        const { walletAddress, agentFid, ownerFid} = req.body;
        const agentData = fetchAgentDetails(agentFid)
        if(!agentData?.pk){
            return res.json({ status: "Target user is not agent",  data: { } });
        }
        const existingData = await redisClient.get(walletAddress);
        const DEFAULT_AMOUNT = 0.1
        if(!existingData){
            return res.status(400).json({status: "Add funds into wallet"})
        }        
        let parsedData = JSON.parse(existingData);
        let amount = Number(parsedData.amount);
        amount = amount - (solToLamports(DEFAULT_AMOUNT))
        parsedData.amount = amount;
        await redisClient.set(walletAddress, JSON.stringify(parsedData));
        buyAndBurnToken({ agentFid, ownerFid, amount: DEFAULT_AMOUNT })
        res.json({ status: "Wallet updated successfully", data: {...parsedData} });
    });

    app.get('/cache/wallet-balance/:id', async (req, res) => {
        const walletAddress = req.params.id
        const existingData = await redisClient.get(walletAddress);
        if(!existingData){
            return res.status(400).json({status:"Please add funds"})
        }
        let parsedData
        if (existingData) {
            parsedData = JSON.parse(existingData);
        }else{
            res.status(400).json({ status: 'Please add funds in wallet' });
        }
        const balance = (parsedData.amount / LAMPORTS_PER_SOL).toFixed(2)
        res.json({ balance });
    });
    
    
    app.post("/update-token-ata", async (req, res) => {
        const { wallet_address, user_ata } = req.body;
        const tokenService = new TokenService();
        const token = await tokenService.updateTokenAta(
            wallet_address,
            user_ata
        );
        return res.status(200).json({ token });
    });

    app.get("/agent-ids", async (req, res) => {
        const farcasterAccountService = new FarcasterAccountService();
        const data = await farcasterAccountService.getFarcasterAccountIds();
        res.json({ data });
    });

        // Start the server
    const PORT = process.env.SERVER_PORT || 3003;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    } catch (error) {
        console.error("Error during app initialization:", error);
    }
};

// Start the application
startServer();
