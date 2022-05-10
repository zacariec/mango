"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shopify_api_1 = __importDefault(require("@shopify/shopify-api"));
const _readThemeConfig_1 = __importDefault(require("../utils/_readThemeConfig"));
const createClient = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield (0, _readThemeConfig_1.default)();
        return new shopify_api_1.default.Clients.Rest(config.mango_private_app.store, config.mango_private_app.password);
    }
    catch (err) {
        console.error(err);
    }
});
exports.default = createClient;
