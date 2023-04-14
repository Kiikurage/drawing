import { DisplayCordPoint, ModelCordPoint, TransformType } from '@drawing/common';

export interface MYMouseEvent {
    target: MouseEventTarget;
    point: ModelCordPoint;
    pointInDisplay: DisplayCordPoint;
    shiftKey: boolean;
    button: number;
}

export type MouseEventTarget =
    | EmptyMouseEventTarget
    | EntityMouseEventTarget
    | TransformHandleMouseEventTarget
    | SingleLineTransformHandleMouseEventTarget;

interface EmptyMouseEventTarget {
    type: 'empty';
}

interface EntityMouseEventTarget {
    type: 'entity';
    entityId: string;
}

interface TransformHandleMouseEventTarget {
    type: 'transformHandle';
    transformType: TransformType;
}

interface SingleLineTransformHandleMouseEventTarget {
    type: 'singleLineTransformHandle';
    point: 'p1' | 'p2';
}
