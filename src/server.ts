// @ts-nocheck
import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./config/db"; // TypeORM DataSource
import {
    getOwnerWalletAddress,
    hasUserExists,
    runPipelineInWorker,
} from "./scrapeTwitter/utils";
import { Router, Request, Response } from "express";
import { OWNER_TYPE } from "./config/constantTypes";
import { TokenService } from "./services/tokenServices";
import {
    buyToken,
    createToken,
    createWallet,
    sellToken,
    transferSol,
} from "./api/contract.action";
import createAndSaveFarcasterAccountAndWallet from "./createFarcaster/createFarcasterAccount";
import {
    getUserByFid,
    getWalletByOwnerId,
    saveToken,
    saveUser,
    saveWallet,
} from "./dbHandler";
import { checkAvailableFid, getRandomFid } from "./api/farcaster.action";
import { FarcasterAccountService } from "./services/farcasterAccountService";
import ENV_CONFIG from "./config/env";

const startServer = async () => {
    try {
    // Initialize the database
    await AppDataSource.initialize();
    console.log("Data source has been initialized!");

    // Set up Express app
    const app = express();
    app.use(cors());
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


    const loadBalanceIntoWallet = async ({recipientWalletAddress, senderWalletAddress, amount}: {recipientWalletAddress: string, senderWalletAddress: string, amount: number}) => {
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

        const wallet = await getWalletByOwnerId(user.pk);
        res.json({ walletAddress: wallet?.wallet_address });
    });

    app.post("/launch-agent", async (req, res) => {
        try {
            const { username, name, language, twitterUsername: unOrganizedTwitterUsername, ownerFid } = req.body;
            const twitterUsername = unOrganizedTwitterUsername?.toLowerCase();
            const {ownerWalletAddress, userPk} = await getOwnerWalletAddress({fid: ownerFid});
            const lowerUsername = username?.toLowerCase();
            const signer_uuid = '1234567890';
            const fid = 194
            // const fid = await getRandomFid();
            // const isNameAvailable = await checkAvailableFid(lowerUsername);
            // if (!isNameAvailable) {
            //     return res.status(400).json({ error: "Name not available" });
            // }
            // if (!lowerUsername || !name || !language || !twitterUsername) {
            //     return res
            //         .status(400)
            //         .json({ error: "All fields are required" });
            // }
            // const { signer_uuid, agentId } = await createAndSaveFarcasterAccountAndWallet({
            //         FID: fid,
            //         username: lowerUsername,
            //         name,
            //         user_fk: BigInt(userPk)
            //     }) as any;
            // const wallet = await createAndSaveWallet({ownerFk: BigInt(agentId), ownerType: OWNER_TYPE.FARCASER_ACCOUNT});
            // await loadBalanceIntoWallet({recipientWalletAddress: wallet.walletAddress, senderWalletAddress: ownerWalletAddress, amount: 0.1});
            // const { txHash, mint, listing, mintVault, solVault, seed } =
            //     await createToken({ solAddress: wallet.walletAddress });
            // await saveToken({
            //     farcasterAccountFk: BigInt(agentId),
            //     txHash,
            //     mint,
            //     listing,
            //     mintVault,
            //     solVault,
            //     seed,
            //     walletAddress: wallet.walletAddress,
            // });
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

    app.post("/create-user", async (req, res) => {
        try {
            const { fid, username } = req.body;
            if (await hasUserExists(fid)) {
                return res.status(200).json({ status: "already exists" });
            }
            const { walletName, walletId, walletAddress } = await createWallet();
            const user = await saveUser({ fid, username });
            await saveWallet({ ownerFk: user.pk, ownerType: OWNER_TYPE.USER, walletName, walletId, walletAddress });
            return res.status(200).json({ status: "created" });
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

    app.post("/buy-token", async (req, res) => {
        const { agentFid, ownerFid, amount } = req.body;
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
