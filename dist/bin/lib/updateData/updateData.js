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
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const getPublished_1 = __importDefault(require("../shopify/getPublished"));
const getAsset_1 = __importDefault(require("../shopify/getAsset"));
const updateData = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = (typeof options !== 'undefined' && Object.keys(options).length !== 0) ? options : null;
    const spinner = (0, ora_1.default)('Updating config/settings_data.json').start();
    try {
        spinner.text = `Finding the Published Theme`;
        const published = yield (0, getPublished_1.default)();
        const id = (settings !== null)
            ? (Object.values(settings)[0] === true)
                ? published.id
                : Object.values(settings)[0]
            : published.id;
        spinner.text = `Getting config settings from Theme: ${id}`;
        const { asset } = yield (0, getAsset_1.default)(id, 'config/settings_data.json');
        const { value: data } = asset;
        fs_extra_1.default.writeFileSync(path_1.default.resolve('./shop/src/config/settings_data.json'), data.toString(), { encoding: 'utf8' });
        spinner.succeed(`Successfully updated config/settings_data.json from Theme: ${id}`);
    }
    catch (err) {
        spinner.fail('Error updating config/settings_data.json');
        console.error(err);
    }
});
exports.default = updateData;
