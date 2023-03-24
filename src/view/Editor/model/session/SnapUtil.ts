import { Record } from '../../../../lib/Record';
import { ModelCordBox } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { Patch } from '../../../../model/Patch';
import { ModelCordPoint, Point } from '../../../../model/Point';
import { EntityMap } from '../EntityMap';
import { SnapPointType, TransformType } from '../TransformType';

export function transform(
    box: ModelCordBox,
    transformType: TransformType,
    prevPoint: ModelCordPoint,
    nextPoint: ModelCordPoint
): ModelCordBox {
    for (const profile of transformType) {
        const diff = nextPoint[profile.posKey] - prevPoint[profile.posKey];

        box = Patch.apply(box, {
            point: { [profile.posKey]: box.point[profile.posKey] + diff * profile.posFactor },
            size: { [profile.sizeKey]: box.size[profile.sizeKey] + diff * profile.sizeFactor },
        });
    }

    return box;
}

export function snap(
    box: ModelCordBox,
    snapTargets: EntityMap,
    transformType: TransformType,
    delta: number
): ModelCordBox {
    const points = getSnapPoints(box);

    for (const profile of transformType) {
        const snapResult = getBestSnapResult(
            profile.snapSources
                .map((type) => points[type])
                .map((point) => getSnap(point, snapTargets, profile.posKey, delta))
        );
        if (snapResult.pairs.length === 0) continue;

        const [prevPoint, nextPoint] = snapResult.pairs[0];

        const diff = nextPoint[profile.posKey] - prevPoint[profile.posKey];

        box = Patch.apply(box, {
            point: { [profile.posKey]: box.point[profile.posKey] + diff * profile.posFactor },
            size: { [profile.sizeKey]: box.size[profile.sizeKey] + diff * profile.sizeFactor },
        });
    }

    return box;
}

export function getSnap(
    point: ModelCordPoint,
    snapTargets: EntityMap,
    direction: 'x' | 'y',
    delta: number
): SnapResult {
    const pairs: [ModelCordPoint, ModelCordPoint][] = [];
    let minDistance = delta;

    for (const entity of Object.values(snapTargets)) {
        const box = Entity.getBoundingBox(entity);

        for (const anchorPoint of Object.values(getSnapPoints(box))) {
            const distance = Math.abs(anchorPoint[direction] - point[direction]);
            if (distance < minDistance) {
                minDistance = distance;
                pairs.length = 0;
            }
            if (distance <= minDistance) pairs.push([point, anchorPoint]);
        }
    }

    return { distance: minDistance, pairs };
}

function getBestSnapResult(results: SnapResult[]): SnapResult {
    let minDistance = Infinity;
    const pairs: [ModelCordPoint, ModelCordPoint][] = [];

    for (const result of results) {
        if (result.distance < minDistance) {
            minDistance = result.distance;
            pairs.length = 0;
        }
        if (result.distance <= minDistance) pairs.push(...result.pairs);
    }

    return { distance: minDistance, pairs };
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
    distance: number;
    pairs: [ModelCordPoint, ModelCordPoint][];
}
