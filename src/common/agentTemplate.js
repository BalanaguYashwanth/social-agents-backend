"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentTemplate = void 0;
const agentTemplate = ({ name, username, farcasterFid, farcasterNeynarSignerUuid, language, character }) => {
    return {
        ...character,
        name,
        username,
        "clients": [
            "farcaster"
        ],
        "modelProvider": "openai",
        settings: {
            secrets: {
                FARCASTER_FID: farcasterFid,
                FARCASTER_NEYNAR_SIGNER_UUID: farcasterNeynarSignerUuid
            },
            voice: { model: language }
        },
        system: 'Roleplay and generate interesting dialogue on behalf of user. Never use emojis or hashtags or cringe stuff like that. Never act like an assistant.',
    };
};
exports.agentTemplate = agentTemplate;
