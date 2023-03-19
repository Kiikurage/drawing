import { Camera } from '../components/Editor/model/Camera';

export interface Point {
    x: number;
    y: number;
}

export module Point {
    export function toModel(camera: Camera, point: DisplayCordPoint): ModelCordPoint {
        return ModelCordPoint({
            x: point.x / camera.scale + camera.point.x,
            y: point.y / camera.scale + camera.point.y,
        });
    }

    export function toDisplay(camera: Camera, point: ModelCordPoint): DisplayCordPoint {
        return DisplayCordPoint({
            x: (point.x - camera.point.x) * camera.scale,
            y: (point.y - camera.point.y) * camera.scale,
        });
    }
}

declare const displayCordPoint: unique symbol;

export type DisplayCordPoint = Point & { [displayCordPoint]: never };

export const DisplayCordPoint = (point: Point) => point as DisplayCordPoint;

declare const modelCordPoint: unique symbol;

export type ModelCordPoint = Point & { [modelCordPoint]: never };

export const ModelCordPoint = (point: Point) => point as ModelCordPoint;
