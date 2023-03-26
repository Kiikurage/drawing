import { ModelCordBox } from '../../../model/Box';
import { ModelCordPoint } from '../../../model/Point';
import { Transform } from './Transform';

export type SnapPointType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';

export interface TransformType {
    (box: ModelCordBox, prevPoint: ModelCordPoint, nextPoint: ModelCordPoint): Transform;
}

export module TransformType {
    export const RESIZE_TOP: TransformType = (box, prevPoint, nextPoint) =>
        Transform.scale(
            1,
            (box.size.height - (nextPoint.y - prevPoint.y)) / box.size.height,
            box.point.x,
            box.point.y
        ).translate(0, nextPoint.y - prevPoint.y);

    export const RESIZE_LEFT: TransformType = (box, prevPoint, nextPoint) =>
        Transform.scale(
            (box.size.width - (nextPoint.x - prevPoint.x)) / box.size.width,
            1,
            box.point.x,
            box.point.y
        ).translate(nextPoint.x - prevPoint.x, 0);

    export const RESIZE_RIGHT: TransformType = (box, prevPoint, nextPoint) =>
        Transform.scale((box.size.width + nextPoint.x - prevPoint.x) / box.size.width, 1, box.point.x, box.point.y);

    export const RESIZE_BOTTOM: TransformType = (box, prevPoint, nextPoint) =>
        Transform.scale(1, (box.size.height + nextPoint.y - prevPoint.y) / box.size.height, box.point.x, box.point.y);

    export const RESIZE_TOP_LEFT: TransformType = (box, prevPoint, nextPoint) =>
        Transform.then(RESIZE_TOP(box, prevPoint, nextPoint)).then(RESIZE_LEFT(box, prevPoint, nextPoint));

    export const RESIZE_TOP_RIGHT: TransformType = (box, prevPoint, nextPoint) =>
        Transform.then(RESIZE_TOP(box, prevPoint, nextPoint)).then(RESIZE_RIGHT(box, prevPoint, nextPoint));

    export const RESIZE_BOTTOM_LEFT: TransformType = (box, prevPoint, nextPoint) =>
        Transform.then(RESIZE_BOTTOM(box, prevPoint, nextPoint)).then(RESIZE_LEFT(box, prevPoint, nextPoint));

    export const RESIZE_BOTTOM_RIGHT: TransformType = (box, prevPoint, nextPoint) =>
        Transform.then(RESIZE_BOTTOM(box, prevPoint, nextPoint)).then(RESIZE_RIGHT(box, prevPoint, nextPoint));

    export const TRANSLATE: TransformType = (box, prevPoint, nextPoint) =>
        Transform.translate(nextPoint.x - prevPoint.x, nextPoint.y - prevPoint.y);
}
