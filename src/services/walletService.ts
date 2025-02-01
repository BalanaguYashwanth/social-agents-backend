import { Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import { Wallet } from "../models/wallet";
import { OWNER_TYPE } from "../config/constantTypes";

export class WalletService {
    private walletRepository: Repository<Wallet>;

    constructor() {
        this.walletRepository = AppDataSource.getRepository(Wallet);
    }

    async createWallet(walletData: Partial<Wallet>) {
        const wallet = this.walletRepository.create(walletData);
        return await this.walletRepository.save(wallet);
    }

    async getAllWallets() {
        return await this.walletRepository.find();
    }

    async fetchWalletByOwnerId({ ownerFk, ownerType }: { ownerFk: number; ownerType: OWNER_TYPE }) {
        try {
            return await this.walletRepository.findOne({
                where: { owner_fk: BigInt(ownerFk), owner_type: ownerType },
            });
        } catch (error) {
            console.error('Error fetching wallet:', error);
            throw new Error('Failed to retrieve wallet details');
        }
    }
    
}
