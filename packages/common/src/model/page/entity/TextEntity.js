"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEntityDelegate = exports.TextEntity = void 0;
const randomId_1 = require("../../../lib/randomId");
const Box_1 = require("../../Box");
const Patch_1 = require("../../Patch");
const Point_1 = require("../../Point");
const Size_1 = require("../../Size");
var TextEntity;
(function (TextEntity) {
    function create(data) {
        return Patch_1.Patch.apply({
            id: (0, randomId_1.randomId)(),
            type: 'text',
            p1: Point_1.Point.model(0, 0),
            text: '',
            size: Size_1.Size.model(1, 1),
            zIndex: 0,
            palette: 'BLACK',
            contentSize: Size_1.Size.model(1, 1),
            horizontalAlign: 'left',
            verticalAlign: 'top',
        }, data);
    }
    TextEntity.create = create;
})(TextEntity = exports.TextEntity || (exports.TextEntity = {}));
exports.TextEntityDelegate = {
    getBoundingBox(entity) {
        return Box_1.Box.model(entity.p1.x, entity.p1.y, entity.size.width, entity.size.height);
    },
    transform(entity, transform) {
        const newBox = transform.apply(exports.TextEntityDelegate.getBoundingBox(entity));
        return {
            p1: {
                x: newBox.size.width < 0 ? newBox.point.x + newBox.size.width : newBox.point.x,
                y: newBox.size.height < 0 ? newBox.point.y + newBox.size.height : newBox.point.y,
            },
            size: {
                width: Math.abs(newBox.size.width),
                height: Math.abs(newBox.size.height),
            },
        };
    },
    isTextEditable() {
        return true;
    },
    includes(entity, point) {
        return Box_1.Box.includes(exports.TextEntityDelegate.getBoundingBox(entity), point);
    },
};
//# sourceMappingURL=TextEntity.js.map