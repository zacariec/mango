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
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const configureYML = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const environmentKey = options.env ? options.env : 'development';
        const config = {
            [environmentKey]: {
                directory: options.dir ? options.dir : `shop/dist`,
                password: options.password,
                theme_id: `${options.themeid}`,
                store: options.store,
                ignores: [options.file ? options.file : `.shopifyignores`]
            },
            'mango_private_app': {
                store: options.store,
                password: options.password
            }
        };
        yield fs_extra_1.default.writeFile('config.yml', js_yaml_1.default.dump(config));
    }
    catch (err) {
        console.error(err);
    }
});
exports.default = configureYML;
