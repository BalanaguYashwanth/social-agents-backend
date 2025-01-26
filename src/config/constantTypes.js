"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OWNER_TYPE = exports.WALLET_TYPE = exports.CHAIN_TYPE = exports.PLATFORM = void 0;
exports.PLATFORM = {
    FARCASTER: 'farcaster',
};
var CHAIN_TYPE;
(function (CHAIN_TYPE) {
    CHAIN_TYPE[CHAIN_TYPE["SOLANA"] = 1] = "SOLANA";
    CHAIN_TYPE[CHAIN_TYPE["ETHEREUM"] = 2] = "ETHEREUM";
})(CHAIN_TYPE || (exports.CHAIN_TYPE = CHAIN_TYPE = {}));
//embedded wallets
var WALLET_TYPE;
(function (WALLET_TYPE) {
    WALLET_TYPE[WALLET_TYPE["PRIVY"] = 1] = "PRIVY";
    WALLET_TYPE[WALLET_TYPE["TURNKEY"] = 2] = "TURNKEY";
})(WALLET_TYPE || (exports.WALLET_TYPE = WALLET_TYPE = {}));
var OWNER_TYPE;
(function (OWNER_TYPE) {
    OWNER_TYPE[OWNER_TYPE["USER"] = 1] = "USER";
    OWNER_TYPE[OWNER_TYPE["FARCASER_ACCOUNT"] = 2] = "FARCASER_ACCOUNT";
    OWNER_TYPE[OWNER_TYPE["TWITTER_ACCOUNT"] = 3] = "TWITTER_ACCOUNT";
})(OWNER_TYPE || (exports.OWNER_TYPE = OWNER_TYPE = {}));
