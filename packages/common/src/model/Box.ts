import { Camera } from './Camera';
import { DisplayCordPoint, ModelCordPoint, Point } from './Point';
import { DisplayCordSize, ModelCordSize, Size } from './Size';

export module Box {
    export function fromPoints(p1: DisplayCordPoint, p2: DisplayCordPoint): DisplayCordBox;
    export function fromPoints(p1: ModelCordPoint, p2: ModelCordPoint): ModelCordBox;
    export function fromPoints(
        p1: ModelCordPoint | DisplayCordPoint,
        p2: ModelCordPoint | DisplayCordPoint
    ): ModelCordBox | DisplayCordBox {
        return {
            point: {
                x: Math.min(p1.x, p2.x),
                y: Math.min(p1.y, p2.y),
            },
            size: {
                width: Math.abs(p1.x - p2.x),
                height: Math.abs(p1.y - p2.y),
            },
        } as ModelCordBox | DisplayCordBox;
    }

    export function isOverlap(box1: DisplayCordBox, box2: DisplayCordBox): boolean;
    export function isOverlap(box1: ModelCordBox, box2: ModelCordBox): boolean;
    export function isOverlap(box1: ModelCordBox | DisplayCordBox, box2: ModelCordBox | DisplayCordBox): boolean {
        return (
            box1.point.x < box2.point.x + box2.size.width &&
            box2.point.x < box1.point.x + box1.size.width &&
            box1.point.y < box2.point.y + box2.size.height &&
            box2.point.y < box1.point.y + box1.size.height
        );
    }

    export function model(x: number, y: number, width: number, height: number): ModelCordBox {
        return {
            point: Point.model(x, y),
            size: Size.model(width, height),
        };
    }

    export function display(x: number, y: number, width: number, height: number): DisplayCordBox {
        return {
            point: Point.display(x, y),
            size: Size.display(width, height),
        };
    }

    export function toModel(camera: Camera, box: DisplayCordBox): ModelCordBox {
        return {
            point: Point.toModel(camera, box.point),
            size: Size.toModel(camera, box.size),
        };
    }

    export function toDisplay(camera: Camera, box: ModelCordBox): DisplayCordBox {
        return {
            point: Point.toDisplay(camera, box.point),
            size: Size.toDisplay(camera, box.size),
        };
    }

    export function includes(box: ModelCordBox, point: ModelCordPoint): boolean;
    export function includes(box: DisplayCordBox, point: DisplayCordPoint): boolean;
    export function includes(box: DisplayCordBox | ModelCordBox, point: DisplayCordPoint | ModelCordPoint): boolean {
        return (
            box.point.x <= point.x &&
            point.x <= box.point.x + box.size.width &&
            box.point.y <= point.y &&
            point.y <= box.point.y + box.size.height
        );
    }
}

export interface ModelCordBox {
    point: ModelCordPoint;
    size: ModelCordSize;
}

export interface DisplayCordBox {
    point: DisplayCordPoint;
    size: DisplayCordSize;
}
