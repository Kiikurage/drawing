"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const Point_1 = require("./Point");
var Camera;
(function (Camera) {
    function create() {
        return {
            point: Point_1.Point.model(0, 0),
            // [ディスプレイ座標系/モデル座標系]
            scale: 1,
        };
    }
    Camera.create = create;
    function setScale(prevCamera, point, nextScale) {
        const { point: { x: prevX, y: prevY }, scale: prevScale, } = prevCamera;
        /**
         * 焦点とviewportの左上の画面座標系での距離は変わらない
         * (fx-prevX)*prevScale = (fx-nextX)*nextScale
         * nextScale*nextX = nextScale*fx - prevScale*(fx-prevX)
         *
         * nextX = fx - prevScale/nextScale*(fx-prevX)
         */
        const nextX = point.x - (prevScale / nextScale) * (point.x - prevX);
        const nextY = point.y - (prevScale / nextScale) * (point.y - prevY);
        return { scale: nextScale, point: Point_1.Point.model(nextX, nextY) };
    }
    Camera.setScale = setScale;
})(Camera = exports.Camera || (exports.Camera = {}));
//# sourceMappingURL=Camera.js.map