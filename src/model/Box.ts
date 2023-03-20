import { Camera } from '../components/Editor/model/Camera';
import { DisplayCordPoint, ModelCordPoint, Point } from './Point';
import { DisplayCordSize, ModelCordSize, Size } from './Size';

export module Box {
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
