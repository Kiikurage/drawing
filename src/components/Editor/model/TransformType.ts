export type SnapPointType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';

interface TransformProfile {
    posKey: 'x' | 'y';
    posFactor: number;
    sizeKey: 'width' | 'height';
    sizeFactor: number;
    snapSources: SnapPointType[];
}

module TransformProfile {
    export const RESIZE_X_START: TransformProfile = {
        posKey: 'x',
        posFactor: 1,
        sizeKey: 'width',
        sizeFactor: -1,
        snapSources: ['topLeft', 'bottomLeft'],
    };
    export const RESIZE_X_END: TransformProfile = {
        posKey: 'x',
        posFactor: 0,
        sizeKey: 'width',
        sizeFactor: 1,
        snapSources: ['topRight', 'bottomRight'],
    };

    export const RESIZE_Y_START: TransformProfile = {
        posKey: 'y',
        posFactor: 1,
        sizeKey: 'height',
        sizeFactor: -1,
        snapSources: ['topLeft', 'topRight'],
    };
    export const RESIZE_Y_END: TransformProfile = {
        posKey: 'y',
        posFactor: 0,
        sizeKey: 'height',
        sizeFactor: 1,
        snapSources: ['bottomLeft', 'bottomRight'],
    };

    export const TRANSLATE_X: TransformProfile = {
        posKey: 'x',
        posFactor: 1,
        sizeKey: 'width',
        sizeFactor: 0,
        snapSources: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
    };

    export const TRANSLATE_Y: TransformProfile = {
        posKey: 'y',
        posFactor: 1,
        sizeKey: 'height',
        sizeFactor: 0,
        snapSources: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
    };
}

export module TransformType {
    export const RESIZE_TOP_LEFT = [TransformProfile.RESIZE_X_START, TransformProfile.RESIZE_Y_START];
    export const RESIZE_TOP = [TransformProfile.RESIZE_Y_START];
    export const RESIZE_TOP_RIGHT = [TransformProfile.RESIZE_X_END, TransformProfile.RESIZE_Y_START];
    export const RESIZE_LEFT = [TransformProfile.RESIZE_X_START];
    export const RESIZE_RIGHT = [TransformProfile.RESIZE_X_END];
    export const RESIZE_BOTTOM_LEFT = [TransformProfile.RESIZE_X_START, TransformProfile.RESIZE_Y_END];
    export const RESIZE_BOTTOM = [TransformProfile.RESIZE_Y_END];
    export const RESIZE_BOTTOM_RIGHT = [TransformProfile.RESIZE_X_END, TransformProfile.RESIZE_Y_END];
    export const TRANSLATE = [TransformProfile.TRANSLATE_X, TransformProfile.TRANSLATE_Y];
}

export type TransformType =
    | typeof TransformType.RESIZE_TOP_LEFT
    | typeof TransformType.RESIZE_TOP
    | typeof TransformType.RESIZE_TOP_RIGHT
    | typeof TransformType.RESIZE_LEFT
    | typeof TransformType.RESIZE_RIGHT
    | typeof TransformType.RESIZE_BOTTOM_LEFT
    | typeof TransformType.RESIZE_BOTTOM
    | typeof TransformType.RESIZE_BOTTOM_RIGHT
    | typeof TransformType.TRANSLATE;
