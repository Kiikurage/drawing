"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
const Point_1 = require("./Point");
const Size_1 = require("./Size");
var Box;
(function (Box) {
    function fromPoints(p1, p2) {
        return {
            point: {
                x: Math.min(p1.x, p2.x),
                y: Math.min(p1.y, p2.y),
            },
            size: {
                width: Math.abs(p1.x - p2.x),
                height: Math.abs(p1.y - p2.y),
            },
        };
    }
    Box.fromPoints = fromPoints;
    function isOverlap(box1, box2) {
        return (box1.point.x < box2.point.x + box2.size.width &&
            box2.point.x < box1.point.x + box1.size.width &&
            box1.point.y < box2.point.y + box2.size.height &&
            box2.point.y < box1.point.y + box1.size.height);
    }
    Box.isOverlap = isOverlap;
    function model(x, y, width, height) {
        return {
            point: Point_1.Point.model(x, y),
            size: Size_1.Size.model(width, height),
        };
    }
    Box.model = model;
    function display(x, y, width, height) {
        return {
            point: Point_1.Point.display(x, y),
            size: Size_1.Size.display(width, height),
        };
    }
    Box.display = display;
    function toModel(camera, box) {
        return {
            point: Point_1.Point.toModel(camera, box.point),
            size: Size_1.Size.toModel(camera, box.size),
        };
    }
    Box.toModel = toModel;
    function toDisplay(camera, box) {
        return {
            point: Point_1.Point.toDisplay(camera, box.point),
            size: Size_1.Size.toDisplay(camera, box.size),
        };
    }
    Box.toDisplay = toDisplay;
    function includes(box, point) {
        return (box.point.x <= point.x &&
            point.x <= box.point.x + box.size.width &&
            box.point.y <= point.y &&
            point.y <= box.point.y + box.size.height);
    }
    Box.includes = includes;
})(Box = exports.Box || (exports.Box = {}));
//# sourceMappingURL=Box.js.map