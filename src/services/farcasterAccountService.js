"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const farcaster_account_1 = require("../models/farcaster_account");
class FarcasterAccountService {
    constructor() {
        this.farcasterAccountRepository = db_1.AppDataSource.getRepository(farcaster_account_1.FarcasterAccount);
    }
    async createFarcasterAccount(farcasterAccountData) {
        try {
            const hasFarcasterAccount = await this.farcasterAccountRepository.findOne({
                where: { fid: farcasterAccountData.fid },
            });
            if (hasFarcasterAccount) {
                return hasFarcasterAccount;
            }
            const farcasterAccount = this.farcasterAccountRepository.create(farcasterAccountData);
            return await this.farcasterAccountRepository.save(farcasterAccount);
        }
        catch (error) {
            console.log("Postgresql db query error", error);
            throw new Error(error?.message);
        }
    }
    async findFarcasterAccountByFid(fid) {
        const farcasterAccount = await this.farcasterAccountRepository.findOne({
            where: { fid },
        });
        return farcasterAccount;
    }
    async getFarcasterAccountIds() {
        const jsonFidArr = (await this.farcasterAccountRepository.find({
            select: {
                fid: true,
            },
        }));
        const fids = jsonFidArr.map(({ fid }) => fid);
        return fids;
    }
    async getAllFarcasterAccounts() {
        return await this.farcasterAccountRepository.find();
    }
}
exports.default = FarcasterAccountService;
