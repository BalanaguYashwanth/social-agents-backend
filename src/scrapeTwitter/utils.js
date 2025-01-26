"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerWalletAddress = exports.solToLamports = exports.getDeadline = exports.getRandomImageUrl = exports.hasUserExists = exports.runPipelineInWorker = exports.getJsonl = void 0;
const generateCharacter_1 = require("./generateCharacter");
const worker_threads_1 = require("worker_threads");
const env_1 = __importDefault(require("../config/env"));
const external_action_1 = require("../api/external.action");
const agentTemplate_1 = require("../common/agentTemplate");
const server_auth_1 = require("@privy-io/server-auth");
const userService_1 = require("../services/userService");
const dbHandler_1 = require("../dbHandler");
const dbHandler_2 = require("../dbHandler");
const getJsonl = (jsonlFilePath) => {
    const data = fs?.readFileSync(jsonlFilePath, "utf8");
    const result = data
        .split("\n")
        .filter((line) => line.trim() !== "") // Remove empty lines
        .map((line) => JSON.parse(line)); // Parse each line into JSON objects
    return result;
};
exports.getJsonl = getJsonl;
const runPipelineInWorker = ({ username, name, language, signerUuid, fid, twitterUsername, }) => {
    const worker = new worker_threads_1.Worker(`${env_1.default.FILE_Path}/src/scrapeTwitter/pipelineWorker.js`, {
        workerData: { username, twitterUsername },
    });
    worker.on("message", async (message) => {
        try {
            if (message.status === "completed") {
                const { username, createdAt } = message;
                //todo - don't save character in file path once it pushed to db
                const character = await (0, generateCharacter_1.generateCharacter)({
                    username,
                    twitterUsername,
                    name,
                    date: createdAt,
                });
                const newAgent = (0, agentTemplate_1.agentTemplate)({
                    name,
                    username,
                    language,
                    farcasterFid: fid,
                    farcasterNeynarSignerUuid: signerUuid,
                    character,
                });
                const response = await (0, external_action_1.addAgent)(newAgent);
                console.log("successfully added agent", response);
            }
            else if (message.status === "failed") {
                console.log("worker failed", message);
            }
        }
        catch (err) {
            console.log("worker agent message error", err);
        }
    });
    worker.on("error", (error) => {
        console.log("worker error", error);
    });
    worker.on("exit", (code) => {
        if (code !== 0) {
            console.error(`Worker exited with code ${code}`);
        }
    });
};
exports.runPipelineInWorker = runPipelineInWorker;
const privy = new server_auth_1.PrivyClient(env_1.default.PRIVY_APP_ID, env_1.default.PRIVY_APP_SECRET);
const hasUserExists = async (fid) => {
    const userService = new userService_1.UserService();
    const user = await userService.getUserByFid(fid);
    return user?.fid ? true : false;
};
exports.hasUserExists = hasUserExists;
const getRandomImageUrl = () => {
    return `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 10000)}`;
};
exports.getRandomImageUrl = getRandomImageUrl;
const getDeadline = () => {
    const now = Math.floor(Date.now() / 1000);
    const oneHour = 60 * 60;
    return BigInt(now + oneHour);
};
exports.getDeadline = getDeadline;
const solToLamports = (sol) => sol * 1000000000;
exports.solToLamports = solToLamports;
const getOwnerWalletAddress = async ({ fid }) => {
    const user = await (0, dbHandler_2.getUserByFid)(fid);
    const ownerWallet = await (0, dbHandler_1.getWalletByOwnerId)(user?.pk);
    const ownerWalletAddress = ownerWallet?.wallet_address;
    return { ownerWalletAddress, userPk: user?.pk };
};
exports.getOwnerWalletAddress = getOwnerWalletAddress;
