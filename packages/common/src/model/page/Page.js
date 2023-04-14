"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const randomId_1 = require("../../lib/randomId");
const Patch_1 = require("../Patch");
var Page;
(function (Page) {
    function create(data = {}) {
        return Patch_1.Patch.apply({
            id: (0, randomId_1.randomId)(),
            entities: {},
        }, data);
    }
    Page.create = create;
})(Page = exports.Page || (exports.Page = {}));
//# sourceMappingURL=Page.js.map