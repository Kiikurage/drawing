import { Camera } from '../view/Editor/model/Camera';

export module Size {
    export function model(width: number, height: number): ModelCordSize {
        return { width, height } as ModelCordSize;
    }

    export function display(width: number, height: number): DisplayCordSize {
        return { width, height } as DisplayCordSize;
    }

    export function toModel(camera: Camera, size: DisplayCordSize): ModelCordSize {
        return model(size.width / camera.scale, size.height / camera.scale);
    }

    export function toDisplay(camera: Camera, size: ModelCordSize): DisplayCordSize {
        return display(size.width * camera.scale, size.height * camera.scale);
    }
}

declare const displayCordSize: unique symbol;

export type DisplayCordSize = {
    [displayCordSize]: number;
    width: number;
    height: number;
};

declare const modelCordSize: unique symbol;

export type ModelCordSize = {
    [modelCordSize]: number;
    width: number;
    height: number;
};
