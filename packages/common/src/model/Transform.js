"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = void 0;
const Point_1 = require("./Point");
const Box_1 = require("./Box");
class Transform {
    scaleX = 1;
    scaleY = 1;
    translateX = 0;
    translateY = 0;
    apply(obj) {
        if ('point' in obj) {
            return Box_1.Box.model(obj.point.x * this.scaleX + this.translateX, obj.point.y * this.scaleY + this.translateY, obj.size.width * this.scaleX, obj.size.height * this.scaleY);
        }
        else {
            return Point_1.Point.model(obj.x * this.scaleX + this.translateX, obj.y * this.scaleY + this.translateY);
        }
    }
    scale(scaleX, scaleY, originX = 0, originY = 0) {
        this.translate(-originX, -originY);
        this.scaleX *= scaleX;
        this.scaleY *= scaleY;
        this.translateX *= scaleX;
        this.translateY *= scaleY;
        this.translate(originX, originY);
        return this;
    }
    translate(translateX, translateY) {
        this.translateX += translateX;
        this.translateY += translateY;
        return this;
    }
    then(other) {
        this.scaleX *= other.scaleX;
        this.scaleY *= other.scaleY;
        this.translateX = this.translateX * other.scaleX + other.translateX;
        this.translateY = this.translateY * other.scaleY + other.translateY;
        return this;
    }
    static scale(scaleX, scaleY, originX, originY) {
        return new Transform().scale(scaleX, scaleY, originX, originY);
    }
    static translate(translateX, translateY) {
        return new Transform().translate(translateX, translateY);
    }
    static then(other) {
        return new Transform().then(other);
    }
}
exports.Transform = Transform;
//# sourceMappingURL=Transform.js.map