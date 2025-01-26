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
exports.Wallet = void 0;
const typeorm_1 = require("typeorm");
const constantTypes_1 = require("../config/constantTypes");
let Wallet = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)("wallet")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = typeorm_1.BaseEntity;
    let _pk_decorators;
    let _pk_initializers = [];
    let _pk_extraInitializers = [];
    let _wallet_address_decorators;
    let _wallet_address_initializers = [];
    let _wallet_address_extraInitializers = [];
    let _wallet_name_decorators;
    let _wallet_name_initializers = [];
    let _wallet_name_extraInitializers = [];
    let _created_at_decorators;
    let _created_at_initializers = [];
    let _created_at_extraInitializers = [];
    let _chain_type_decorators;
    let _chain_type_initializers = [];
    let _chain_type_extraInitializers = [];
    let _wallet_type_decorators;
    let _wallet_type_initializers = [];
    let _wallet_type_extraInitializers = [];
    let _wallet_id_decorators;
    let _wallet_id_initializers = [];
    let _wallet_id_extraInitializers = [];
    let _owner_fk_decorators;
    let _owner_fk_initializers = [];
    let _owner_fk_extraInitializers = [];
    let _owner_type_decorators;
    let _owner_type_initializers = [];
    let _owner_type_extraInitializers = [];
    var Wallet = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.pk = __runInitializers(this, _pk_initializers, void 0);
            this.wallet_address = (__runInitializers(this, _pk_extraInitializers), __runInitializers(this, _wallet_address_initializers, void 0));
            this.wallet_name = (__runInitializers(this, _wallet_address_extraInitializers), __runInitializers(this, _wallet_name_initializers, void 0));
            this.created_at = (__runInitializers(this, _wallet_name_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            this.chain_type = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _chain_type_initializers, void 0));
            this.wallet_type = (__runInitializers(this, _chain_type_extraInitializers), __runInitializers(this, _wallet_type_initializers, void 0));
            this.wallet_id = (__runInitializers(this, _wallet_type_extraInitializers), __runInitializers(this, _wallet_id_initializers, void 0));
            // `owner_id` column to reference the agent/user ID
            this.owner_fk = (__runInitializers(this, _wallet_id_extraInitializers), __runInitializers(this, _owner_fk_initializers, void 0));
            // `owner_type` column to specify whether the wallet belongs to an agent or user
            this.owner_type = (__runInitializers(this, _owner_fk_extraInitializers), __runInitializers(this, _owner_type_initializers, void 0));
            __runInitializers(this, _owner_type_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Wallet");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _pk_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)("increment", { type: "bigint" })];
        _wallet_address_decorators = [(0, typeorm_1.Column)({ type: "text", nullable: false, unique: true })];
        _wallet_name_decorators = [(0, typeorm_1.Column)({ type: "text", nullable: true })];
        _created_at_decorators = [(0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })];
        _chain_type_decorators = [(0, typeorm_1.Column)({ type: "int", nullable: false, default: constantTypes_1.CHAIN_TYPE.SOLANA })];
        _wallet_type_decorators = [(0, typeorm_1.Column)({ type: "int", nullable: false, default: constantTypes_1.WALLET_TYPE.TURNKEY })];
        _wallet_id_decorators = [(0, typeorm_1.Column)({ type: "text", nullable: false, unique: true })];
        _owner_fk_decorators = [(0, typeorm_1.Column)({ type: "bigint", nullable: false })];
        _owner_type_decorators = [(0, typeorm_1.Column)({ type: "int", nullable: false })];
        __esDecorate(null, null, _pk_decorators, { kind: "field", name: "pk", static: false, private: false, access: { has: obj => "pk" in obj, get: obj => obj.pk, set: (obj, value) => { obj.pk = value; } }, metadata: _metadata }, _pk_initializers, _pk_extraInitializers);
        __esDecorate(null, null, _wallet_address_decorators, { kind: "field", name: "wallet_address", static: false, private: false, access: { has: obj => "wallet_address" in obj, get: obj => obj.wallet_address, set: (obj, value) => { obj.wallet_address = value; } }, metadata: _metadata }, _wallet_address_initializers, _wallet_address_extraInitializers);
        __esDecorate(null, null, _wallet_name_decorators, { kind: "field", name: "wallet_name", static: false, private: false, access: { has: obj => "wallet_name" in obj, get: obj => obj.wallet_name, set: (obj, value) => { obj.wallet_name = value; } }, metadata: _metadata }, _wallet_name_initializers, _wallet_name_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: obj => "created_at" in obj, get: obj => obj.created_at, set: (obj, value) => { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _chain_type_decorators, { kind: "field", name: "chain_type", static: false, private: false, access: { has: obj => "chain_type" in obj, get: obj => obj.chain_type, set: (obj, value) => { obj.chain_type = value; } }, metadata: _metadata }, _chain_type_initializers, _chain_type_extraInitializers);
        __esDecorate(null, null, _wallet_type_decorators, { kind: "field", name: "wallet_type", static: false, private: false, access: { has: obj => "wallet_type" in obj, get: obj => obj.wallet_type, set: (obj, value) => { obj.wallet_type = value; } }, metadata: _metadata }, _wallet_type_initializers, _wallet_type_extraInitializers);
        __esDecorate(null, null, _wallet_id_decorators, { kind: "field", name: "wallet_id", static: false, private: false, access: { has: obj => "wallet_id" in obj, get: obj => obj.wallet_id, set: (obj, value) => { obj.wallet_id = value; } }, metadata: _metadata }, _wallet_id_initializers, _wallet_id_extraInitializers);
        __esDecorate(null, null, _owner_fk_decorators, { kind: "field", name: "owner_fk", static: false, private: false, access: { has: obj => "owner_fk" in obj, get: obj => obj.owner_fk, set: (obj, value) => { obj.owner_fk = value; } }, metadata: _metadata }, _owner_fk_initializers, _owner_fk_extraInitializers);
        __esDecorate(null, null, _owner_type_decorators, { kind: "field", name: "owner_type", static: false, private: false, access: { has: obj => "owner_type" in obj, get: obj => obj.owner_type, set: (obj, value) => { obj.owner_type = value; } }, metadata: _metadata }, _owner_type_initializers, _owner_type_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Wallet = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Wallet = _classThis;
})();
exports.Wallet = Wallet;
