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

    export function toPoints(box: DisplayCordBox): [DisplayCordPoint, DisplayCordPoint];
    export function toPoints(box: ModelCordBox): [ModelCordPoint, ModelCordPoint];
    export function toPoints(
        box: DisplayCordBox | ModelCordBox
    ): [DisplayCordPoint | ModelCordPoint, DisplayCordPoint | ModelCordPoint] {
        return [
            box.point,
            {
                x: box.point.x + box.size.width,
                y: box.point.y + box.size.height,
            } as ModelCordPoint | DisplayCordPoint,
        ];
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

    export function union(box1: ModelCordBox, box2: ModelCordBox): ModelCordBox;
    export function union(box1: DisplayCordBox, box2: DisplayCordBox): DisplayCordBox;
    export function union(
        box1: DisplayCordBox | ModelCordBox,
        box2: DisplayCordBox | ModelCordBox
    ): DisplayCordBox | ModelCordBox {
        const [p11, p12] = Box.toPoints(box1 as DisplayCordBox);
        const [p21, p22] = Box.toPoints(box2 as DisplayCordBox);

        const p1 = Point.display(Math.min(p11.x, p21.x), Math.min(p11.y, p21.y));
        const p2 = Point.display(Math.max(p12.x, p22.x), Math.max(p12.y, p22.y));

        return Box.fromPoints(p1, p2) as DisplayCordBox | ModelCordBox;
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
