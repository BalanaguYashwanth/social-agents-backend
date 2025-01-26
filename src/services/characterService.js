"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterService = void 0;
const db_1 = require("../config/db");
const character_1 = require("../models/character");
class CharacterService {
    constructor() {
        this.characterRepository = db_1.AppDataSource.getRepository(character_1.Character);
    }
    async createCharacter(characterData) {
        const agent = this.characterRepository.create({ data: characterData });
        return await this.characterRepository.save(agent);
    }
    async getAllCharacters() {
        return await this.characterRepository.find();
    }
}
exports.CharacterService = CharacterService;
