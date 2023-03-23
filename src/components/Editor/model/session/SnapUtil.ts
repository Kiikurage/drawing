import { ModelCordBox } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { Patch } from '../../../../model/Patch';
import { ModelCordPoint, Point } from '../../../../model/Point';
import { EntityMap } from '../EntityMap';
import { TransformType } from '../TransformType';

export interface SnapInfo {
    distance: number;
    originPoint: ModelCordPoint;
    points: ModelCordPoint[];
}

export interface SnapResult {
    box: ModelCordBox;
    snapEntries: [ModelCordPoint, ModelCordPoint][];
}

export function snap(
    box: ModelCordBox,
    snapTargets: EntityMap,
    transformType: TransformType,
    delta: number
): ModelCordBox {
    box = snapX(box, snapTargets, transformType, delta);
    box = snapY(box, snapTargets, transformType, delta);
    return box;
}

function snapX(box: ModelCordBox, snapTargets: EntityMap, transformType: TransformType, delta: number): ModelCordBox {
    const {
        point: topLeft,
        size: { width, height },
    } = box;

    const topLeftSnapResult = getSnap(topLeft, snapTargets, 'x', delta);
    const topRightSnapResult = getSnap(Point.model(topLeft.x + width, topLeft.y), snapTargets, 'x', delta);
    const bottomLeftSnapResult = getSnap(Point.model(topLeft.x, topLeft.y + height), snapTargets, 'x', delta);
    const bottomRightSnapResult = getSnap(Point.model(topLeft.x + width, topLeft.y + height), snapTargets, 'x', delta);
    const centerSnapResult = getSnap(
        Point.model(topLeft.x + width / 2, topLeft.y + height / 2),
        snapTargets,
        'x',
        delta
    );

    if (transformType === 'translate') {
        const snapResult = [
            topLeftSnapResult,
            topRightSnapResult,
            bottomLeftSnapResult,
            bottomRightSnapResult,
            centerSnapResult,
        ].reduce((r1, r2) => (r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1));

        if (snapResult.points.length === 0) return box;
        return Patch.apply(box, {
            point: {
                x: box.point.x + (snapResult.points[0].x - snapResult.originPoint.x),
            },
        });
    }
    if (transformType.x === 'start') {
        const snapResult = [topLeftSnapResult, bottomLeftSnapResult].reduce((r1, r2) =>
            r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1
        );

        if (snapResult.points.length === 0) return box;
        return Patch.apply(box, {
            point: {
                x: box.point.x + (snapResult.points[0].x - snapResult.originPoint.x),
            },
            size: {
                width: box.size.width - (snapResult.points[0].x - snapResult.originPoint.x),
            },
        });
    }
    if (transformType.x === 'end') {
        const snapResult = [topRightSnapResult, bottomRightSnapResult].reduce((r1, r2) =>
            r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1
        );

        if (snapResult.points.length === 0) return box;
        return Patch.apply(box, {
            size: {
                width: box.size.width + (snapResult.points[0].x - snapResult.originPoint.x),
            },
        });
    }

    return box;
}

function snapY(box: ModelCordBox, snapTargets: EntityMap, transformType: TransformType, delta: number): ModelCordBox {
    const {
        point: topLeft,
        size: { width, height },
    } = box;

    const topLeftSnapResult = getSnap(topLeft, snapTargets, 'y', delta);
    const topRightSnapResult = getSnap(Point.model(topLeft.x + width, topLeft.y), snapTargets, 'y', delta);
    const bottomLeftSnapResult = getSnap(Point.model(topLeft.x, topLeft.y + height), snapTargets, 'y', delta);
    const bottomRightSnapResult = getSnap(Point.model(topLeft.x + width, topLeft.y + height), snapTargets, 'y', delta);
    const centerSnapResult = getSnap(
        Point.model(topLeft.x + width / 2, topLeft.y + height / 2),
        snapTargets,
        'y',
        delta
    );

    if (transformType === 'translate') {
        const snapResult = [
            topLeftSnapResult,
            topRightSnapResult,
            bottomLeftSnapResult,
            bottomRightSnapResult,
            centerSnapResult,
        ].reduce((r1, r2) => (r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1));

        if (snapResult.points.length === 0) return box;
        return Patch.apply(box, {
            point: {
                y: box.point.y + (snapResult.points[0].y - snapResult.originPoint.y),
            },
        });
    }
    if (transformType.y === 'start') {
        const snapResult = [topLeftSnapResult, topRightSnapResult].reduce((r1, r2) =>
            r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1
        );

        if (snapResult.points.length === 0) return box;
        return Patch.apply(box, {
            point: {
                y: box.point.y + (snapResult.points[0].y - snapResult.originPoint.y),
            },
            size: {
                height: box.size.height - (snapResult.points[0].y - snapResult.originPoint.y),
            },
        });
    }
    if (transformType.y === 'end') {
        const snapResult = [bottomLeftSnapResult, bottomRightSnapResult].reduce((r1, r2) =>
            r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1
        );

        if (snapResult.points.length === 0) return box;
        return Patch.apply(box, {
            size: {
                height: box.size.height + (snapResult.points[0].y - snapResult.originPoint.y),
            },
        });
    }

    return box;
}

export function getSnap(point: ModelCordPoint, snapTargets: EntityMap, direction: 'x' | 'y', delta: number): SnapInfo {
    const points: ModelCordPoint[] = [];
    let distance = delta;
    for (const entity of Object.values(snapTargets)) {
        const box = Entity.getBoundingBox(entity);

        const topLeft = box.point;
        const topLeftDistance = Math.abs(topLeft[direction] - point[direction]);
        if (topLeftDistance < distance) {
            distance = topLeftDistance;
            points.length = 0;
        }
        if (topLeftDistance <= distance) points.push(topLeft);

        const topRight = Point.model(box.point.x + box.size.width, box.point.y);
        const topRightDistance = Math.abs(topRight[direction] - point[direction]);
        if (topRightDistance < distance) {
            distance = topRightDistance;
            points.length = 0;
        }
        if (topRightDistance <= distance) points.push(topRight);

        const bottomLeft = Point.model(box.point.x, box.point.y + box.size.height);
        const bottomLeftDistance = Math.abs(bottomLeft[direction] - point[direction]);
        if (bottomLeftDistance < distance) {
            distance = bottomLeftDistance;
            points.length = 0;
        }
        if (bottomLeftDistance <= distance) points.push(bottomLeft);

        const bottomRight = Point.model(box.point.x + box.size.width, box.point.y + box.size.height);
        const bottomRightDistance = Math.abs(bottomRight[direction] - point[direction]);
        if (bottomRightDistance < distance) {
            distance = bottomRightDistance;
            points.length = 0;
        }
        if (bottomRightDistance <= distance) points.push(bottomRight);

        const center = Point.model(box.point.x + box.size.width / 2, box.point.y + box.size.height / 2);
        const centerDistance = Math.abs(center[direction] - point[direction]);
        if (centerDistance < distance) {
            distance = centerDistance;
            points.length = 0;
        }
        if (centerDistance <= distance) points.push(center);
    }
    return { originPoint: point, distance, points };
}
