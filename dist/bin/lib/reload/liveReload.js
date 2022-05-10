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
exports.removeLiveReload = exports.liveReload = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const removeLiveReload = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield fs_extra_1.default.readdir(path_1.default.resolve('./shop/src/layout'));
        // files.forEach((file) => {
        //   const fileData = await
        // });
        const fileData = yield fs_extra_1.default.readFile(path_1.default.resolve('./shop/src/layout/theme.liquid'));
        if (fileData.toString().match(/<!-- Start Live Server Reloading -->([\s\S]*?)<!-- End Live Server Reloading -->/g)) {
            const dataToWrite = fileData.toString().replace(/<!-- Start Live Server Reloading -->([\s\S]*?)<!-- End Live Server Reloading -->/g, '');
            yield fs_extra_1.default.writeFile(path_1.default.resolve('./shop/src/layout/theme.liquid'), dataToWrite);
        }
    }
    catch (err) {
        return console.error(err);
    }
});
exports.removeLiveReload = removeLiveReload;
const liveReload = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileData = yield fs_extra_1.default.readFile(path_1.default.resolve('./shop/src/layout/theme.liquid'));
        if (fileData.toString().includes('<!-- Start Live Server Reloading -->') === false) {
            const fileArray = fileData.toString().split('</body>');
            const dataToWrite = `
                ${fileArray[0]}
                    <!-- Start Live Server Reloading -->
                    <script>
                        var ws = new WebSocket('ws://localhost:9000');
                        ws.onmessage = function(evt) { location.reload(); }
                    </script>
                    <!-- End Live Server Reloading -->
                </body>
                ${fileArray[1]}
            `;
            yield fs_extra_1.default.writeFile(path_1.default.resolve('./shop/src/layout/theme.liquid'), dataToWrite);
        }
    }
    catch (err) {
        return console.error(err);
    }
});
exports.liveReload = liveReload;
