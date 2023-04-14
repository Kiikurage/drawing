"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineEntityDelegate = exports.LineEntity = void 0;
const randomId_1 = require("../../../lib/randomId");
const Box_1 = require("../../Box");
const Patch_1 = require("../../Patch");
const Point_1 = require("../../Point");
var LineEntity;
(function (LineEntity) {
    function create(data = {}) {
        return Patch_1.Patch.apply({
            id: (0, randomId_1.randomId)(),
            type: 'line',
            p1: Point_1.Point.model(0, 0),
            p2: Point_1.Point.model(1, 1),
            zIndex: 0,
            text: '',
            palette: 'BLACK',
            linkedEntityId1: null,
            linkedEntityId2: null,
            arrowHeadType1: 'none',
            arrowHeadType2: 'arrow',
        }, data);
    }
    LineEntity.create = create;
})(LineEntity = exports.LineEntity || (exports.LineEntity = {}));
exports.LineEntityDelegate = {
    getBoundingBox(entity) {
        return Box_1.Box.fromPoints(entity.p1, entity.p2);
    },
    transform(entity, transform) {
        return {
            p1: transform.apply(entity.p1),
            p2: transform.apply(entity.p2),
        };
    },
    isTextEditable() {
        return true;
    },
    includes(entity, point) {
        return false;
    },
};
//# sourceMappingURL=LineEntity.js.map