"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAgent = void 0;
const env_1 = __importDefault(require("../config/env"));
const addAgent = async (agent) => {
    await fetch(env_1.default.NOSQL_API, {
        method: 'POST',
        body: JSON.stringify(agent)
    });
};
exports.addAgent = addAgent;
