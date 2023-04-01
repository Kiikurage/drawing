import { ModelCordPoint, Point } from './Point';
import { Box, ModelCordBox } from './Box';

export class Transform {
    scaleX = 1;
    scaleY = 1;
    translateX = 0;
    translateY = 0;

    apply(point: ModelCordPoint): ModelCordPoint;
    apply(box: ModelCordBox): ModelCordBox;
    apply(obj: ModelCordPoint | ModelCordBox): ModelCordPoint | ModelCordBox {
        if ('point' in obj) {
            return Box.model(
                obj.point.x * this.scaleX + this.translateX,
                obj.point.y * this.scaleY + this.translateY,
                obj.size.width * this.scaleX,
                obj.size.height * this.scaleY
            );
        } else {
            return Point.model(obj.x * this.scaleX + this.translateX, obj.y * this.scaleY + this.translateY);
        }
    }

    scale(scaleX: number, scaleY: number, originX = 0, originY = 0): this {
        this.translate(-originX, -originY);
        this.scaleX *= scaleX;
        this.scaleY *= scaleY;
        this.translateX *= scaleX;
        this.translateY *= scaleY;
        this.translate(originX, originY);
        return this;
    }

    translate(translateX: number, translateY: number): this {
        this.translateX += translateX;
        this.translateY += translateY;
        return this;
    }

    then(other: Transform): this {
        this.scaleX *= other.scaleX;
        this.scaleY *= other.scaleY;
        this.translateX = this.translateX * other.scaleX + other.translateX;
        this.translateY = this.translateY * other.scaleY + other.translateY;
        return this;
    }

    static scale(scaleX: number, scaleY: number, originX?: number, originY?: number): Transform {
        return new Transform().scale(scaleX, scaleY, originX, originY);
    }

    static translate(translateX: number, translateY: number): Transform {
        return new Transform().translate(translateX, translateY);
    }

    static then(other: Transform): Transform {
        return new Transform().then(other);
    }
}
