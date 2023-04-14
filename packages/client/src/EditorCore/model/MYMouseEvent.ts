import { DisplayCordPoint, ModelCordPoint } from '@drawing/common/src/model/Point';
import { TransformType } from '@drawing/common/src/model/TransformType';

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
