"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Point_1 = require("../../Point");
const Size_1 = require("../../Size");
const LineEntity_1 = require("./LineEntity");
const PolygonEntity_1 = require("./PolygonEntity");
const TextEntity_1 = require("./TextEntity");
var Entity;
(function (Entity) {
    const delegates = {
        polygon: PolygonEntity_1.PolygonEntityDelegate,
        text: TextEntity_1.TextEntityDelegate,
        line: LineEntity_1.LineEntityDelegate,
    };
    function getDelegate(entity) {
        return delegates[entity.type];
    }
    function getBoundingBox(entity) {
        return getDelegate(entity).getBoundingBox(entity);
    }
    Entity.getBoundingBox = getBoundingBox;
    function computeBoundingBox(entities) {
        let x0 = +Infinity, y0 = +Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const entity of entities) {
            const box = Entity.getBoundingBox(entity);
            x0 = Math.min(box.point.x, x0);
            y0 = Math.min(box.point.y, y0);
            x1 = Math.max(box.point.x + box.size.width, x1);
            y1 = Math.max(box.point.y + box.size.height, y1);
        }
        const width = x1 - x0;
        const height = y1 - y0;
        return { point: Point_1.Point.model(x0, y0), size: Size_1.Size.model(width, height) };
    }
    Entity.computeBoundingBox = computeBoundingBox;
    function includes(entity, point) {
        return getDelegate(entity).includes(entity, point);
    }
    Entity.includes = includes;
    function transform(entity, transform) {
        return getDelegate(entity).transform(entity, transform);
    }
    Entity.transform = transform;
    function isTextEditable(entity) {
        return getDelegate(entity).isTextEditable(entity);
    }
    Entity.isTextEditable = isTextEditable;
})(Entity = exports.Entity || (exports.Entity = {}));
//# sourceMappingURL=Entity.js.map