"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const db_1 = require("../config/db");
const token_1 = require("../models/token");
class TokenService {
    constructor() {
        this.tokenRepository = db_1.AppDataSource.getRepository(token_1.Token);
    }
    async createToken(tokenData) {
        if (await this.getTokenByListing(tokenData.listing)) {
            throw new Error("Token already exists");
        }
        const token = this.tokenRepository.create(tokenData);
        return await this.tokenRepository.save(token);
    }
    async getTokenByListing(listing) {
        return await this.tokenRepository.findOne({ where: { listing } });
    }
    async updateTokenAta(wallet_address, user_ata) {
        return await this.tokenRepository.update({ wallet_address }, { user_ata });
    }
    async getAllTokens() {
        return await this.tokenRepository.find();
    }
    async getTokenByWalletAddress(wallet_address) {
        return await this.tokenRepository.findOne({
            where: { wallet_address },
        });
    }
    async getTokenByFarcasterAccountId(farcasterAccountFk) {
        return await this.tokenRepository.findOne({
            // pass pk of farcaster account
            where: { farcaster_account_fk: BigInt(farcasterAccountFk) },
        });
    }
}
exports.TokenService = TokenService;
