import { Camera } from '../components/Editor/model/Camera';

export module Size {
    export function model(size: { [displayCordSize]?: never; width: number; height: number }): ModelCordSize {
        return size as ModelCordSize;
    }

    export function display(size: { [modelCordSize]?: never; width: number; height: number }): DisplayCordSize {
        return size as DisplayCordSize;
    }

    export function toModel(camera: Camera, size: DisplayCordSize): ModelCordSize {
        return model({
            width: size.width / camera.scale,
            height: size.height / camera.scale,
        });
    }

    export function toDisplay(camera: Camera, size: ModelCordSize): DisplayCordSize {
        return display({
            width: size.width * camera.scale,
            height: size.height * camera.scale,
        });
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
