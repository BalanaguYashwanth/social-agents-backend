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
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_1 = require("viem/accounts");
const hub_nodejs_1 = require("@farcaster/hub-nodejs");
const bip39 = __importStar(require("bip39"));
const chains_1 = require("viem/chains");
const viem_1 = require("viem");
const farcaster_action_1 = require("../api/farcaster.action");
const utils_1 = require("../scrapeTwitter/utils");
const farcaster_action_2 = require("../api/farcaster.action");
const dbHandler_1 = require("../dbHandler");
// this code imported from neynar docs
const createAndSaveFarcasterAccountAndWallet = async ({ FID, username, name, user_fk }) => {
    try {
        let deadline = 0;
        let requested_user_custody_address = "";
        let signature = "";
        const latest_deadline = (0, utils_1.getDeadline)();
        deadline = parseInt(latest_deadline);
        const mnemonic = bip39.generateMnemonic();
        const requestedUserAccount = (0, accounts_1.mnemonicToAccount)(mnemonic);
        const requestedUserAccountSigner = new hub_nodejs_1.ViemLocalEip712Signer(requestedUserAccount);
        requested_user_custody_address = requestedUserAccount.address;
        const farcasterPublicClient = (0, viem_1.createPublicClient)({
            chain: chains_1.optimism,
            transport: (0, viem_1.http)(),
        });
        const requestedUserNonce = await farcasterPublicClient.readContract({
            address: hub_nodejs_1.ID_REGISTRY_ADDRESS,
            abi: hub_nodejs_1.idRegistryABI,
            functionName: "nonces",
            args: [requestedUserAccount.address],
        });
        const requestedUserSignature = (await requestedUserAccountSigner.signTransfer({
            fid: BigInt(FID),
            to: requestedUserAccount.address,
            nonce: requestedUserNonce,
            deadline,
        }));
        //todo - check this signature part do we need to save it in db?
        console.log("\n todo - check this signature part do we need to save it in db? signature: ", (0, viem_1.bytesToHex)(requestedUserSignature?.value), "\n");
        signature = (0, viem_1.bytesToHex)(requestedUserSignature.value);
        const registeredUser = await (0, farcaster_action_1.getRegisteredUser)(deadline, requested_user_custody_address, FID, signature, username);
        const agent = await (0, dbHandler_1.saveAgent)({ registeredUser, FID, username, mnemonic, user_fk });
        await (0, farcaster_action_2.updateFarcasterProfile)({ signer_uuid: registeredUser?.signer?.signer_uuid, username, name });
        return { signer_uuid: registeredUser?.signer?.signer_uuid, agentId: agent?.pk };
    }
    catch (error) {
        console.log("error: ", error);
    }
};
exports.default = createAndSaveFarcasterAccountAndWallet;
