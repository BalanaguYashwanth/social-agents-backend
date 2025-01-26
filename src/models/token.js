"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const typeorm_1 = require("typeorm");
const farcaster_account_1 = require("./farcaster_account");
let Token = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)("token")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = typeorm_1.BaseEntity;
    let _pk_decorators;
    let _pk_initializers = [];
    let _pk_extraInitializers = [];
    let _farcaster_account_fk_decorators;
    let _farcaster_account_fk_initializers = [];
    let _farcaster_account_fk_extraInitializers = [];
    let _listing_decorators;
    let _listing_initializers = [];
    let _listing_extraInitializers = [];
    let _mint_decorators;
    let _mint_initializers = [];
    let _mint_extraInitializers = [];
    let _mint_vault_decorators;
    let _mint_vault_initializers = [];
    let _mint_vault_extraInitializers = [];
    let _sol_vault_decorators;
    let _sol_vault_initializers = [];
    let _sol_vault_extraInitializers = [];
    let _seed_decorators;
    let _seed_initializers = [];
    let _seed_extraInitializers = [];
    let _user_ata_decorators;
    let _user_ata_initializers = [];
    let _user_ata_extraInitializers = [];
    let _wallet_address_decorators;
    let _wallet_address_initializers = [];
    let _wallet_address_extraInitializers = [];
    let _transaction_hash_decorators;
    let _transaction_hash_initializers = [];
    let _transaction_hash_extraInitializers = [];
    let _token_name_decorators;
    let _token_name_initializers = [];
    let _token_name_extraInitializers = [];
    let _created_at_decorators;
    let _created_at_initializers = [];
    let _created_at_extraInitializers = [];
    var Token = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.pk = __runInitializers(this, _pk_initializers, void 0);
            this.farcaster_account_fk = (__runInitializers(this, _pk_extraInitializers), __runInitializers(this, _farcaster_account_fk_initializers, void 0));
            this.listing = (__runInitializers(this, _farcaster_account_fk_extraInitializers), __runInitializers(this, _listing_initializers, void 0));
            this.mint = (__runInitializers(this, _listing_extraInitializers), __runInitializers(this, _mint_initializers, void 0));
            this.mint_vault = (__runInitializers(this, _mint_extraInitializers), __runInitializers(this, _mint_vault_initializers, void 0));
            this.sol_vault = (__runInitializers(this, _mint_vault_extraInitializers), __runInitializers(this, _sol_vault_initializers, void 0));
            this.seed = (__runInitializers(this, _sol_vault_extraInitializers), __runInitializers(this, _seed_initializers, void 0));
            this.user_ata = (__runInitializers(this, _seed_extraInitializers), __runInitializers(this, _user_ata_initializers, void 0));
            this.wallet_address = (__runInitializers(this, _user_ata_extraInitializers), __runInitializers(this, _wallet_address_initializers, void 0));
            this.transaction_hash = (__runInitializers(this, _wallet_address_extraInitializers), __runInitializers(this, _transaction_hash_initializers, void 0));
            this.token_name = (__runInitializers(this, _transaction_hash_extraInitializers), __runInitializers(this, _token_name_initializers, void 0));
            this.created_at = (__runInitializers(this, _token_name_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            __runInitializers(this, _created_at_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Token");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _pk_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)("increment", { type: "bigint" })];
        _farcaster_account_fk_decorators = [(0, typeorm_1.ManyToOne)(() => farcaster_account_1.FarcasterAccount, (farcasterAccount) => farcasterAccount.pk, {
                onDelete: "CASCADE",
            }), (0, typeorm_1.JoinColumn)({ name: "farcaster_account_fk" })];
        _listing_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _mint_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _mint_vault_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _sol_vault_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _seed_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _user_ata_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _wallet_address_decorators = [(0, typeorm_1.Column)({ nullable: false })];
        _transaction_hash_decorators = [(0, typeorm_1.Column)({ nullable: false })];
        _token_name_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _created_at_decorators = [(0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })];
        __esDecorate(null, null, _pk_decorators, { kind: "field", name: "pk", static: false, private: false, access: { has: obj => "pk" in obj, get: obj => obj.pk, set: (obj, value) => { obj.pk = value; } }, metadata: _metadata }, _pk_initializers, _pk_extraInitializers);
        __esDecorate(null, null, _farcaster_account_fk_decorators, { kind: "field", name: "farcaster_account_fk", static: false, private: false, access: { has: obj => "farcaster_account_fk" in obj, get: obj => obj.farcaster_account_fk, set: (obj, value) => { obj.farcaster_account_fk = value; } }, metadata: _metadata }, _farcaster_account_fk_initializers, _farcaster_account_fk_extraInitializers);
        __esDecorate(null, null, _listing_decorators, { kind: "field", name: "listing", static: false, private: false, access: { has: obj => "listing" in obj, get: obj => obj.listing, set: (obj, value) => { obj.listing = value; } }, metadata: _metadata }, _listing_initializers, _listing_extraInitializers);
        __esDecorate(null, null, _mint_decorators, { kind: "field", name: "mint", static: false, private: false, access: { has: obj => "mint" in obj, get: obj => obj.mint, set: (obj, value) => { obj.mint = value; } }, metadata: _metadata }, _mint_initializers, _mint_extraInitializers);
        __esDecorate(null, null, _mint_vault_decorators, { kind: "field", name: "mint_vault", static: false, private: false, access: { has: obj => "mint_vault" in obj, get: obj => obj.mint_vault, set: (obj, value) => { obj.mint_vault = value; } }, metadata: _metadata }, _mint_vault_initializers, _mint_vault_extraInitializers);
        __esDecorate(null, null, _sol_vault_decorators, { kind: "field", name: "sol_vault", static: false, private: false, access: { has: obj => "sol_vault" in obj, get: obj => obj.sol_vault, set: (obj, value) => { obj.sol_vault = value; } }, metadata: _metadata }, _sol_vault_initializers, _sol_vault_extraInitializers);
        __esDecorate(null, null, _seed_decorators, { kind: "field", name: "seed", static: false, private: false, access: { has: obj => "seed" in obj, get: obj => obj.seed, set: (obj, value) => { obj.seed = value; } }, metadata: _metadata }, _seed_initializers, _seed_extraInitializers);
        __esDecorate(null, null, _user_ata_decorators, { kind: "field", name: "user_ata", static: false, private: false, access: { has: obj => "user_ata" in obj, get: obj => obj.user_ata, set: (obj, value) => { obj.user_ata = value; } }, metadata: _metadata }, _user_ata_initializers, _user_ata_extraInitializers);
        __esDecorate(null, null, _wallet_address_decorators, { kind: "field", name: "wallet_address", static: false, private: false, access: { has: obj => "wallet_address" in obj, get: obj => obj.wallet_address, set: (obj, value) => { obj.wallet_address = value; } }, metadata: _metadata }, _wallet_address_initializers, _wallet_address_extraInitializers);
        __esDecorate(null, null, _transaction_hash_decorators, { kind: "field", name: "transaction_hash", static: false, private: false, access: { has: obj => "transaction_hash" in obj, get: obj => obj.transaction_hash, set: (obj, value) => { obj.transaction_hash = value; } }, metadata: _metadata }, _transaction_hash_initializers, _transaction_hash_extraInitializers);
        __esDecorate(null, null, _token_name_decorators, { kind: "field", name: "token_name", static: false, private: false, access: { has: obj => "token_name" in obj, get: obj => obj.token_name, set: (obj, value) => { obj.token_name = value; } }, metadata: _metadata }, _token_name_initializers, _token_name_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: obj => "created_at" in obj, get: obj => obj.created_at, set: (obj, value) => { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Token = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Token = _classThis;
})();
exports.Token = Token;
