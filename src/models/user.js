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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const constantTypes_1 = require("../config/constantTypes");
let User = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)("user")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = typeorm_1.BaseEntity;
    let _pk_decorators;
    let _pk_initializers = [];
    let _pk_extraInitializers = [];
    let _fid_decorators;
    let _fid_initializers = [];
    let _fid_extraInitializers = [];
    let _chain_type_decorators;
    let _chain_type_initializers = [];
    let _chain_type_extraInitializers = [];
    let _username_decorators;
    let _username_initializers = [];
    let _username_extraInitializers = [];
    let _created_at_decorators;
    let _created_at_initializers = [];
    let _created_at_extraInitializers = [];
    var User = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.pk = __runInitializers(this, _pk_initializers, void 0);
            this.fid = (__runInitializers(this, _pk_extraInitializers), __runInitializers(this, _fid_initializers, void 0));
            this.chain_type = (__runInitializers(this, _fid_extraInitializers), __runInitializers(this, _chain_type_initializers, void 0));
            this.username = (__runInitializers(this, _chain_type_extraInitializers), __runInitializers(this, _username_initializers, void 0));
            this.created_at = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            __runInitializers(this, _created_at_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "User");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _pk_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)("increment", { type: "bigint" })];
        _fid_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _chain_type_decorators = [(0, typeorm_1.Column)({ type: "int", nullable: false, default: constantTypes_1.CHAIN_TYPE.SOLANA })];
        _username_decorators = [(0, typeorm_1.Column)({ nullable: false, unique: true })];
        _created_at_decorators = [(0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })];
        __esDecorate(null, null, _pk_decorators, { kind: "field", name: "pk", static: false, private: false, access: { has: obj => "pk" in obj, get: obj => obj.pk, set: (obj, value) => { obj.pk = value; } }, metadata: _metadata }, _pk_initializers, _pk_extraInitializers);
        __esDecorate(null, null, _fid_decorators, { kind: "field", name: "fid", static: false, private: false, access: { has: obj => "fid" in obj, get: obj => obj.fid, set: (obj, value) => { obj.fid = value; } }, metadata: _metadata }, _fid_initializers, _fid_extraInitializers);
        __esDecorate(null, null, _chain_type_decorators, { kind: "field", name: "chain_type", static: false, private: false, access: { has: obj => "chain_type" in obj, get: obj => obj.chain_type, set: (obj, value) => { obj.chain_type = value; } }, metadata: _metadata }, _chain_type_initializers, _chain_type_extraInitializers);
        __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: obj => "username" in obj, get: obj => obj.username, set: (obj, value) => { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: obj => "created_at" in obj, get: obj => obj.created_at, set: (obj, value) => { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
exports.User = User;
