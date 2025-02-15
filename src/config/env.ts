import dotenv from "dotenv";
dotenv.config();

const ENV_CONFIG = {
    DB_URL: process.env.DB_URL,
    FILE_Path: process.env.FILE_Path,
    TEMP_DB_API: process.env.TEMP_DB_API,
    // Farcaster
    FARCASTER_NEYNAR_API_KEY: process.env.FARCASTER_NEYNAR_API_KEY,
    FARCASTER_HUB_URL: process.env.FARCASTER_HUB_URL,
    FARCASTER_NEYNAR_SIGNER_UUID: process.env.FARCASTER_NEYNAR_SIGNER_UUID,
    // Privy
    PRIVY_APP_ID: process.env.PRIVY_APP_ID,
    PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
    PRIVY_AUTHORIZATION_PRIVATE_KEY: process.env.PRIVY_AUTHORIZATION_PRIVATE_KEY,
    // Turnkey
    TURNKEY_ORGANIZATION_ID: process.env.TURNKEY_ORGANIZATION_ID,
    TURNKEY_BASE_URL: process.env.TURNKEY_BASE_URL,
    TURNKEY_API_PUBLIC_KEY: process.env.TURNKEY_API_PUBLIC_KEY,
    TURNKEY_API_PRIVATE_KEY: process.env.TURNKEY_API_PRIVATE_KEY,
    //TempDB
    NOSQL_API: process.env.NOSQL_API,
    //Redis
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    //Helius
    HELIUS_API_KEY: process.env.HELIUS_API_KEY,
    //Gemini
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}

export default ENV_CONFIG;
