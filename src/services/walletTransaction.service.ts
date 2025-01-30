import { Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import { WalletTransaction } from "../models/wallet_transaction.ts";
import { solToLamports } from "../scrapeTwitter/utils.ts";

export class WalletTransactionService {
    private transactionRepository: Repository<WalletTransaction>;

    constructor() {
        this.transactionRepository = AppDataSource.getRepository(WalletTransaction);
    }

    async updateWalletBalance({ walletAddress, amount }: { walletAddress: string; amount: number }) {
        if (!walletAddress) {
            return false;
        }
    
        const result = await this.transactionRepository
            .createQueryBuilder()
            .insert()
            .into("wallet_transaction")
            .values({
                wallet_address: walletAddress,
                amount: solToLamports(amount),
            })
            .orUpdate(["amount"], ["wallet_address"])
            .execute();
    
        return result;
    }

    async getTransactionByWalletAddress(walletAddress: string): Promise<WalletTransaction | null> {
        if (!walletAddress) {
            return null;
        }
        return await this.transactionRepository.findOne({ 
            where: { wallet_address: walletAddress } 
        });
    }
}