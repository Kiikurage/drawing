import { TransformType } from './TransformType';

export type HoverState = EntityHoverState | TransformHandleHoverState;

export interface EntityHoverState {
    type: 'entity';
    entityId: string;
}

export interface TransformHandleHoverState {
    type: 'transformHandle';
    transformType: TransformType;
}

export module TransformHandleHoverState {
    export const RESIZE_TOP_LEFT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.topLeft',
    };
    export const RESIZE_TOP: TransformHandleHoverState = { type: 'transformHandle', transformType: 'resize.top' };
    export const RESIZE_TOP_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.topRight',
    };
    export const RESIZE_LEFT: TransformHandleHoverState = { type: 'transformHandle', transformType: 'resize.left' };
    export const RESIZE_RIGHT: TransformHandleHoverState = { type: 'transformHandle', transformType: 'resize.right' };
    export const RESIZE_BOTTOM_LEFT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.bottomLeft',
    };
    export const RESIZE_BOTTOM: TransformHandleHoverState = { type: 'transformHandle', transformType: 'resize.bottom' };
    export const RESIZE_BOTTOM_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.bottomRight',
    };
    export const TRANSLATE: TransformHandleHoverState = { type: 'transformHandle', transformType: 'translate' };
    export const ROTATE: TransformHandleHoverState = { type: 'transformHandle', transformType: 'rotate' };
}
