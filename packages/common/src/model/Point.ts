import { Camera } from './Camera';

export module Point {
    export function model(x: number, y: number): ModelCordPoint {
        return { x, y } as ModelCordPoint;
    }

    export function display(x: number, y: number): DisplayCordPoint {
        return { x, y } as DisplayCordPoint;
    }

    export function toModel(camera: Camera, point: DisplayCordPoint): ModelCordPoint {
        return model(point.x / camera.scale + camera.point.x, point.y / camera.scale + camera.point.y);
    }

    export function toDisplay(camera: Camera, point: ModelCordPoint): DisplayCordPoint {
        return display((point.x - camera.point.x) * camera.scale, (point.y - camera.point.y) * camera.scale);
    }
}

declare const displayCordPoint: unique symbol;

export type DisplayCordPoint = {
    [displayCordPoint]: never;
    x: number;
    y: number;
};

declare const modelCordPoint: unique symbol;

export type ModelCordPoint = {
    [modelCordPoint]: never;
    x: number;
    y: number;
};
