"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var Point;
(function (Point) {
    function model(x, y) {
        return { x, y };
    }
    Point.model = model;
    function display(x, y) {
        return { x, y };
    }
    Point.display = display;
    function toModel(camera, point) {
        return model(point.x / camera.scale + camera.point.x, point.y / camera.scale + camera.point.y);
    }
    Point.toModel = toModel;
    function toDisplay(camera, point) {
        return display((point.x - camera.point.x) * camera.scale, (point.y - camera.point.y) * camera.scale);
    }
    Point.toDisplay = toDisplay;
})(Point = exports.Point || (exports.Point = {}));
//# sourceMappingURL=Point.js.map