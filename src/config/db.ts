import 'reflect-metadata'
import { DataSource } from "typeorm";
import { FarcasterAccount } from "../models/farcaster_account";
import { User } from "../models/user";
import { Token } from "../models/token";
import { Wallet } from "../models/wallet";
import ENV_CONFIG from "./env";
import { Character } from "../models/character";
import { WalletTransaction } from '../models/wallet_transaction';

export const AppDataSource = new DataSource({
    type: "postgres",
    url: ENV_CONFIG.DB_URL,
    entities: [FarcasterAccount, User, Token, Wallet, Character, WalletTransaction],
    synchronize: false,
    logging: process.env.NODE_ENV !== "production",
    ssl: {
        rejectUnauthorized: false,
    },
    migrations: ["src/migrations/*.ts"],
});
