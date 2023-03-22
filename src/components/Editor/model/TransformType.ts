export module TransformType {
    export const RESIZE_TOP_LEFT = { x: 'start', y: 'start' } as const;
    export const RESIZE_TOP = { x: 'center', y: 'start' } as const;
    export const RESIZE_TOP_RIGHT = { x: 'end', y: 'start' } as const;
    export const RESIZE_LEFT = { x: 'start', y: 'center' } as const;
    export const RESIZE_RIGHT = { x: 'end', y: 'center' } as const;
    export const RESIZE_BOTTOM_LEFT = { x: 'start', y: 'end' } as const;
    export const RESIZE_BOTTOM = { x: 'center', y: 'end' } as const;
    export const RESIZE_BOTTOM_RIGHT = { x: 'end', y: 'end' } as const;
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
    | 'translate';
