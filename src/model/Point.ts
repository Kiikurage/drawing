import { Camera } from '../components/Editor/model/Camera';

export module Point {
    export function model(size: { [displayCordPoint]?: never; x: number; y: number }): ModelCordPoint {
        return size as ModelCordPoint;
    }

    export function display(size: { [modelCordPoint]?: never; x: number; y: number }): DisplayCordPoint {
        return size as DisplayCordPoint;
    }

    export function toModel(camera: Camera, point: DisplayCordPoint): ModelCordPoint {
        return model({
            x: point.x / camera.scale + camera.point.x,
            y: point.y / camera.scale + camera.point.y,
        });
    }

    export function toDisplay(camera: Camera, point: ModelCordPoint): DisplayCordPoint {
        return display({
            x: (point.x - camera.point.x) * camera.scale,
            y: (point.y - camera.point.y) * camera.scale,
        });
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
