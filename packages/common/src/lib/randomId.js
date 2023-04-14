"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomId = void 0;
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
function randomId() {
    return 'xxxxxxxx'.replace(/x/g, () => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return CHARS[Math.floor(Math.random() * CHARS.length)];
    });
}
exports.randomId = randomId;
//# sourceMappingURL=randomId.js.map