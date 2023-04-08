import { EntityMap } from './EntityMap';
import { Transform } from './Transform';
import { SnapPointType, TransformType } from './TransformType';
import { ModelCordPoint, Point } from './Point';
import { ModelCordBox } from './Box';
import { Entity } from './entity/Entity';

export function snapBox(
    box: ModelCordBox,
    snapTargets: EntityMap,
    transformType: TransformType,
    threshold: number
): SnapResult {
    const pairsX: [source: ModelCordPoint, target: ModelCordPoint][] = [];
    const pairsY: [source: ModelCordPoint, target: ModelCordPoint][] = [];
    let bestDiffX = threshold;
    let bestDiffY = threshold;

    for (const point of transformType.getSnapPointsForTransformType(box)) {
        const snapPointResult = snapPoint(point, snapTargets, threshold);

        if (Math.abs(snapPointResult.transform.translateX) < Math.abs(bestDiffX)) {
            bestDiffX = snapPointResult.transform.translateX;
            pairsX.length = 0;
        }
        if (Math.abs(snapPointResult.transform.translateX) <= Math.abs(bestDiffX)) {
            pairsX.push(...snapPointResult.pairsX);
        }
        if (Math.abs(snapPointResult.transform.translateY) < Math.abs(bestDiffY)) {
            bestDiffY = snapPointResult.transform.translateY;
            pairsY.length = 0;
        }
        if (Math.abs(snapPointResult.transform.translateY) <= Math.abs(bestDiffY)) {
            pairsY.push(...snapPointResult.pairsY);
        }
    }

    const prevPoint = Point.model(pairsX[0]?.[0]?.x ?? 0, pairsY[0]?.[0]?.y ?? 0);
    const nextPoint = Point.model(pairsX[0]?.[1]?.x ?? 0, pairsY[0]?.[1]?.y ?? 0);

    const scaleOrigin = transformType.scaleOrigin(box);
    const transform = Transform.scale(
        transformType.scaleFactor.x(box, prevPoint, nextPoint),
        transformType.scaleFactor.y(box, prevPoint, nextPoint),
        scaleOrigin.x,
        scaleOrigin.y
    ).then(transformType.translate(box, prevPoint, nextPoint));

    return {
        transform,
        pairsX,
        pairsY,
    };
}

export function snapPoint(point: ModelCordPoint, snapTargets: EntityMap, threshold: number): SnapResult {
    const pairsX: [source: ModelCordPoint, target: ModelCordPoint][] = [];
    const pairsY: [source: ModelCordPoint, target: ModelCordPoint][] = [];
    let bestDiffX = threshold;
    let bestDiffY = threshold;

    for (const entity of Object.values(snapTargets)) {
        const box = Entity.getBoundingBox(entity);

        for (const targetPoint of Object.values(getSnapPoints(box))) {
            const diffX = targetPoint.x - point.x;
            const diffY = targetPoint.y - point.y;

            if (Math.abs(diffX) < Math.abs(bestDiffX)) {
                bestDiffX = diffX;
                pairsX.length = 0;
            }
            if (Math.abs(diffX) <= Math.abs(bestDiffX)) pairsX.push([point, targetPoint]);
            if (Math.abs(diffY) < Math.abs(bestDiffY)) {
                bestDiffY = diffY;
                pairsY.length = 0;
            }
            if (Math.abs(diffY) <= Math.abs(bestDiffY)) pairsY.push([point, targetPoint]);
        }
    }

    return {
        transform: Transform.translate(bestDiffX, bestDiffY),
        pairsX,
        pairsY,
    };
}

export function getSnapPointsForTransformType(box: ModelCordBox, transformType: TransformType): ModelCordPoint[] {
    const points = getSnapPoints(box);

    switch (transformType) {
        case TransformType.RESIZE_TOP_LEFT:
            return [points.topLeft];
        case TransformType.RESIZE_TOP:
            return [points.topLeft];
        case TransformType.RESIZE_TOP_RIGHT:
            return [points.topRight];
        case TransformType.RESIZE_LEFT:
            return [points.topLeft];
        case TransformType.RESIZE_RIGHT:
            return [points.topRight];
        case TransformType.RESIZE_BOTTOM_LEFT:
            return [points.bottomLeft];
        case TransformType.RESIZE_BOTTOM:
            return [points.bottomLeft];
        case TransformType.RESIZE_BOTTOM_RIGHT:
            return [points.bottomRight];
        case TransformType.TRANSLATE:
            return [points.topLeft, points.topRight, points.bottomLeft, points.bottomRight, points.center];
        default:
            console.dir(transformType);
            throw new Error('Unknown transform type');
    }
}

export function getSnapPoints(box: ModelCordBox): Record<SnapPointType, ModelCordPoint> {
    return {
        topLeft: box.point,
        topRight: Point.model(box.point.x + box.size.width, box.point.y),
        bottomLeft: Point.model(box.point.x, box.point.y + box.size.height),
        bottomRight: Point.model(box.point.x + box.size.width, box.point.y + box.size.height),
        center: Point.model(box.point.x + box.size.width / 2, box.point.y + box.size.height / 2),
    };
}

export interface SnapResult {
    transform: Transform;
    pairsX: [ModelCordPoint, ModelCordPoint][];
    pairsY: [ModelCordPoint, ModelCordPoint][];
}
