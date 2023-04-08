import { Transform } from './Transform';
import { ModelCordBox } from './Box';
import { ModelCordPoint, Point } from './Point';
import { getSnapPoints } from './SnapUtil';

export type SnapPointType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';

export interface TransformType {
    type: string;
    scaleOrigin: (box: ModelCordBox) => ModelCordPoint;
    scaleFactor: {
        x: (box: ModelCordBox, prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) => number;
        y: (box: ModelCordBox, prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) => number;
    };
    translate: (box: ModelCordBox, prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) => Transform;
    getSnapPointsForTransformType: (box: ModelCordBox) => ModelCordPoint[];
}

export module TransformType {
    export const RESIZE_TOP: TransformType = {
        type: 'RESIZE_TOP',
        scaleOrigin: (box) => Point.model(box.point.x, box.point.y + box.size.height),
        scaleFactor: {
            x: () => 1,
            y: (box, prevPoint, nextPoint) => (box.size.height - (nextPoint.y - prevPoint.y)) / box.size.height,
        },
        translate: () => Transform.translate(0, 0),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.topLeft];
        },
    };

    export const RESIZE_LEFT: TransformType = {
        type: 'RESIZE_LEFT',
        scaleOrigin: (box) => Point.model(box.point.x + box.size.width, box.point.y),
        scaleFactor: {
            x: (box, prevPoint, nextPoint) => (box.size.width - (nextPoint.x - prevPoint.x)) / box.size.width,
            y: () => 1,
        },
        translate: () => Transform.translate(0, 0),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.topLeft];
        },
    };

    export const RESIZE_BOTTOM: TransformType = {
        type: 'RESIZE_BOTTOM',
        scaleOrigin: (box) => Point.model(box.point.x, box.point.y),
        scaleFactor: {
            x: () => 1,
            y: (box, prevPoint, nextPoint) => (box.size.height + (nextPoint.y - prevPoint.y)) / box.size.height,
        },
        translate: () => Transform.translate(0, 0),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.bottomLeft];
        },
    };

    export const RESIZE_RIGHT: TransformType = {
        type: 'RESIZE_RIGHT',
        scaleOrigin: (box) => Point.model(box.point.x, box.point.y),
        scaleFactor: {
            x: (box, prevPoint, nextPoint) => (box.size.width + (nextPoint.x - prevPoint.x)) / box.size.width,
            y: () => 1,
        },
        translate: () => Transform.translate(0, 0),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.topRight];
        },
    };

    export const RESIZE_TOP_LEFT: TransformType = {
        type: 'RESIZE_TOP_LEFT',
        scaleOrigin: (box) => Point.model(RESIZE_LEFT.scaleOrigin(box).x, RESIZE_TOP.scaleOrigin(box).y),
        scaleFactor: {
            x: RESIZE_LEFT.scaleFactor.x,
            y: RESIZE_TOP.scaleFactor.y,
        },
        translate: (box, prevPoint, nextPoint) =>
            RESIZE_TOP.translate(box, prevPoint, nextPoint).then(RESIZE_LEFT.translate(box, prevPoint, nextPoint)),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.topLeft];
        },
    };

    export const RESIZE_TOP_RIGHT: TransformType = {
        type: 'RESIZE_TOP_RIGHT',
        scaleOrigin: (box) => Point.model(RESIZE_RIGHT.scaleOrigin(box).x, RESIZE_TOP.scaleOrigin(box).y),
        scaleFactor: {
            x: RESIZE_RIGHT.scaleFactor.x,
            y: RESIZE_TOP.scaleFactor.y,
        },
        translate: (box, prevPoint, nextPoint) =>
            RESIZE_TOP.translate(box, prevPoint, nextPoint).then(RESIZE_RIGHT.translate(box, prevPoint, nextPoint)),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.topRight];
        },
    };

    export const RESIZE_BOTTOM_LEFT: TransformType = {
        type: 'RESIZE_TOP_BOTTOM_LEFT',
        scaleOrigin: (box) => Point.model(RESIZE_LEFT.scaleOrigin(box).x, RESIZE_BOTTOM.scaleOrigin(box).y),
        scaleFactor: {
            x: RESIZE_LEFT.scaleFactor.x,
            y: RESIZE_BOTTOM.scaleFactor.y,
        },
        translate: (box, prevPoint, nextPoint) =>
            RESIZE_BOTTOM.translate(box, prevPoint, nextPoint).then(RESIZE_LEFT.translate(box, prevPoint, nextPoint)),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.bottomLeft];
        },
    };

    export const RESIZE_BOTTOM_RIGHT: TransformType = {
        type: 'RESIZE_BOTTOM_RIGHT',
        scaleOrigin: (box) => Point.model(RESIZE_RIGHT.scaleOrigin(box).x, RESIZE_BOTTOM.scaleOrigin(box).y),
        scaleFactor: {
            x: RESIZE_RIGHT.scaleFactor.x,
            y: RESIZE_BOTTOM.scaleFactor.y,
        },
        translate: (box, prevPoint, nextPoint) =>
            RESIZE_BOTTOM.translate(box, prevPoint, nextPoint).then(RESIZE_RIGHT.translate(box, prevPoint, nextPoint)),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.bottomRight];
        },
    };

    export const TRANSLATE: TransformType = {
        type: 'RESIZE_TOP_TRANSLATE',
        scaleOrigin: (box) => Point.model(box.point.x, box.point.y),
        scaleFactor: {
            x: () => 1,
            y: () => 1,
        },
        translate: (box, prevPoint, nextPoint) =>
            Transform.translate(nextPoint.x - prevPoint.x, nextPoint.y - prevPoint.y),
        getSnapPointsForTransformType: (box: ModelCordBox) => {
            const points = getSnapPoints(box);
            return [points.topLeft, points.topRight, points.bottomLeft, points.bottomRight, points.center];
        },
    };
}
