"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFarcasterProfile = exports.getRegisteredUser = exports.getRandomFid = exports.checkAvailableFid = void 0;
// Farcaster & Neynar API Requests
const axios_1 = __importDefault(require("axios"));
const env_1 = __importDefault(require("../config/env"));
const utils_1 = require("../scrapeTwitter/utils");
const checkAvailableFid = async (fname) => {
    try {
        const url = `${env_1.default.FARCASTER_HUB_URL}/fname/availability?fname=${fname}`;
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', 'x-api-key': env_1.default.FARCASTER_NEYNAR_API_KEY }
        };
        const response = await fetch(url, options);
        const data = await response.json();
        return data?.available || false;
    }
    catch (err) {
        throw new Error(err?.message || 'Error checking FID availability');
    }
};
exports.checkAvailableFid = checkAvailableFid;
const getRandomFid = async () => {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${env_1.default.FARCASTER_HUB_URL}/user/fid`,
            headers: {
                'api_key': env_1.default.FARCASTER_NEYNAR_API_KEY
            }
        };
        const response = await axios_1.default.request(config);
        return response.data.fid;
    }
    catch (error) {
        console.error('Error fetching FID:', error);
        throw error;
    }
};
exports.getRandomFid = getRandomFid;
const getRegisteredUser = async (deadline, requested_user_custody_address, fid, signature, fname) => {
    try {
        const data = JSON.stringify({
            "deadline": deadline,
            "requested_user_custody_address": requested_user_custody_address,
            "fid": fid,
            "signature": signature,
            "fname": fname
        });
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${env_1.default.FARCASTER_HUB_URL}/user`,
            headers: {
                'api_key': env_1.default.FARCASTER_NEYNAR_API_KEY,
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await axios_1.default.request(config);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
    ;
};
exports.getRegisteredUser = getRegisteredUser;
// Updating agent farcaster profile - pic, username, name etc
const updateFarcasterProfile = async ({ signer_uuid, username, name }) => {
    try {
        const url = `${env_1.default?.FARCASTER_HUB_URL}/user`;
        const options = {
            method: "PATCH",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "x-api-key": env_1.default?.FARCASTER_NEYNAR_API_KEY,
            },
            body: JSON.stringify({
                pfp_url: (0, utils_1.getRandomImageUrl)(),
                signer_uuid,
                username,
                display_name: name,
            }),
        };
        const response = await fetch(url, options);
        const data = await response.json();
        console.log("profile farcaster data: ", data);
    }
    catch (error) {
        console.log("error: ", error);
    }
};
exports.updateFarcasterProfile = updateFarcasterProfile;
