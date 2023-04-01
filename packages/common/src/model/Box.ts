import { Camera } from './Camera';
import { DisplayCordPoint, ModelCordPoint, Point } from './Point';
import { DisplayCordSize, ModelCordSize, Size } from './Size';

export module Box {
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
}

export interface ModelCordBox {
    point: ModelCordPoint;
    size: ModelCordSize;
}

export interface DisplayCordBox {
    point: DisplayCordPoint;
    size: DisplayCordSize;
}
