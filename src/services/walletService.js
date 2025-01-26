"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const db_1 = require("../config/db");
const wallet_1 = require("../models/wallet");
class WalletService {
    constructor() {
        this.walletRepository = db_1.AppDataSource.getRepository(wallet_1.Wallet);
    }
    async createWallet(walletData) {
        const wallet = this.walletRepository.create(walletData);
        return await this.walletRepository.save(wallet);
    }
    async getAllWallets() {
        return await this.walletRepository.find();
    }
    async getWalletByOwnerId(ownerFk) {
        return await this.walletRepository.findOne({
            where: { owner_fk: ownerFk },
        });
    }
}
exports.WalletService = WalletService;
