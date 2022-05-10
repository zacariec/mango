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
const client_1 = __importDefault(require("./client"));
const _createEnvironment_1 = __importDefault(require("../utils/_createEnvironment"));
const _readThemeConfig_1 = __importDefault(require("../utils/_readThemeConfig"));
const shopify_api_1 = require("@shopify/shopify-api");
const createTheme = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield (0, _readThemeConfig_1.default)();
    const client = yield (0, client_1.default)();
    const request = yield client.post({
        path: 'themes',
        data: {
            "theme": {
                "name": `${name}`
            }
        },
        type: shopify_api_1.DataType.JSON
    });
    const response = yield request.body;
    yield (0, _createEnvironment_1.default)(name, response.theme.id, config.store, config.password);
    return response;
});
exports.default = createTheme;
