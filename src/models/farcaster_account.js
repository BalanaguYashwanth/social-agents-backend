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
exports.FarcasterAccount = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let FarcasterAccount = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)("farcaster_account")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = typeorm_1.BaseEntity;
    let _pk_decorators;
    let _pk_initializers = [];
    let _pk_extraInitializers = [];
    let _user_fk_decorators;
    let _user_fk_initializers = [];
    let _user_fk_extraInitializers = [];
    let _fid_decorators;
    let _fid_initializers = [];
    let _fid_extraInitializers = [];
    let _username_decorators;
    let _username_initializers = [];
    let _username_extraInitializers = [];
    let _mnemonic_decorators;
    let _mnemonic_initializers = [];
    let _mnemonic_extraInitializers = [];
    let _signer_uuid_decorators;
    let _signer_uuid_initializers = [];
    let _signer_uuid_extraInitializers = [];
    let _public_key_decorators;
    let _public_key_initializers = [];
    let _public_key_extraInitializers = [];
    let _permissions_decorators;
    let _permissions_initializers = [];
    let _permissions_extraInitializers = [];
    let _created_at_decorators;
    let _created_at_initializers = [];
    let _created_at_extraInitializers = [];
    var FarcasterAccount = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.pk = __runInitializers(this, _pk_initializers, void 0);
            this.user_fk = (__runInitializers(this, _pk_extraInitializers), __runInitializers(this, _user_fk_initializers, void 0));
            this.fid = (__runInitializers(this, _user_fk_extraInitializers), __runInitializers(this, _fid_initializers, void 0));
            this.username = (__runInitializers(this, _fid_extraInitializers), __runInitializers(this, _username_initializers, void 0));
            this.mnemonic = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _mnemonic_initializers, void 0));
            this.signer_uuid = (__runInitializers(this, _mnemonic_extraInitializers), __runInitializers(this, _signer_uuid_initializers, void 0));
            this.public_key = (__runInitializers(this, _signer_uuid_extraInitializers), __runInitializers(this, _public_key_initializers, void 0));
            this.permissions = (__runInitializers(this, _public_key_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
            this.created_at = (__runInitializers(this, _permissions_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            __runInitializers(this, _created_at_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FarcasterAccount");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _pk_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)("increment", { type: "bigint" })];
        _user_fk_decorators = [(0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.pk, {
                onDelete: "CASCADE",
            }), (0, typeorm_1.JoinColumn)({ name: "user_fk" })];
        _fid_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _username_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _mnemonic_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _signer_uuid_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _public_key_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _permissions_decorators = [(0, typeorm_1.Column)({ type: "text", array: true, nullable: false })];
        _created_at_decorators = [(0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })];
        __esDecorate(null, null, _pk_decorators, { kind: "field", name: "pk", static: false, private: false, access: { has: obj => "pk" in obj, get: obj => obj.pk, set: (obj, value) => { obj.pk = value; } }, metadata: _metadata }, _pk_initializers, _pk_extraInitializers);
        __esDecorate(null, null, _user_fk_decorators, { kind: "field", name: "user_fk", static: false, private: false, access: { has: obj => "user_fk" in obj, get: obj => obj.user_fk, set: (obj, value) => { obj.user_fk = value; } }, metadata: _metadata }, _user_fk_initializers, _user_fk_extraInitializers);
        __esDecorate(null, null, _fid_decorators, { kind: "field", name: "fid", static: false, private: false, access: { has: obj => "fid" in obj, get: obj => obj.fid, set: (obj, value) => { obj.fid = value; } }, metadata: _metadata }, _fid_initializers, _fid_extraInitializers);
        __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: obj => "username" in obj, get: obj => obj.username, set: (obj, value) => { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
        __esDecorate(null, null, _mnemonic_decorators, { kind: "field", name: "mnemonic", static: false, private: false, access: { has: obj => "mnemonic" in obj, get: obj => obj.mnemonic, set: (obj, value) => { obj.mnemonic = value; } }, metadata: _metadata }, _mnemonic_initializers, _mnemonic_extraInitializers);
        __esDecorate(null, null, _signer_uuid_decorators, { kind: "field", name: "signer_uuid", static: false, private: false, access: { has: obj => "signer_uuid" in obj, get: obj => obj.signer_uuid, set: (obj, value) => { obj.signer_uuid = value; } }, metadata: _metadata }, _signer_uuid_initializers, _signer_uuid_extraInitializers);
        __esDecorate(null, null, _public_key_decorators, { kind: "field", name: "public_key", static: false, private: false, access: { has: obj => "public_key" in obj, get: obj => obj.public_key, set: (obj, value) => { obj.public_key = value; } }, metadata: _metadata }, _public_key_initializers, _public_key_extraInitializers);
        __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: obj => "permissions" in obj, get: obj => obj.permissions, set: (obj, value) => { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: obj => "created_at" in obj, get: obj => obj.created_at, set: (obj, value) => { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FarcasterAccount = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FarcasterAccount = _classThis;
})();
exports.FarcasterAccount = FarcasterAccount;
