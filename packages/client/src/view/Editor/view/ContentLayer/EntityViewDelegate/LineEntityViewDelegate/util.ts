import { ArrowHeadType, Box, Entity, getLineIntersectPoint, LineEntity, ModelCordPoint, Point } from '@drawing/common';

export function computePath(p1: ModelCordPoint, p2: ModelCordPoint, head1: ArrowHeadType, head2: ArrowHeadType) {
    const { x: x0, y: y0 } = Box.fromPoints(p1, p2).point;

    const subPaths: string[] = [];

    subPaths.push(`M${p1.x - x0} ${p1.y - y0}l${p2.x - p1.x} ${p2.y - p1.y}`);

    if (head1 === 'arrow') {
        const [p3, p4] = computeArrowHeadPoint(p1, p2);
        subPaths.push(`M${p3.x - x0} ${p3.y - y0}l${p1.x - p3.x} ${p1.y - p3.y}l${p4.x - p1.x} ${p4.y - p1.y}`);
    }

    if (head2 === 'arrow') {
        const [p3, p4] = computeArrowHeadPoint(p2, p1);
        subPaths.push(`M${p3.x - x0} ${p3.y - y0}l${p2.x - p3.x} ${p2.y - p3.y}l${p4.x - p2.x} ${p4.y - p2.y}`);
    }

    return subPaths.join('');
}

/**
 * @param p1 The point of the line which has arrowhead.
 * @param p2 The other point of the line.
 */
export function computeArrowHeadPoint(p1: ModelCordPoint, p2: ModelCordPoint): [ModelCordPoint, ModelCordPoint] {
    const SIZE = 20;
    const R = (25 * Math.PI) / 180;

    const vx = p2.x - p1.x;
    const vy = p2.y - p1.y;
    const vNorm = Math.sqrt(vx ** 2 + vy ** 2);

    const v3x = ((vx * Math.cos(R) - vy * Math.sin(R)) * SIZE) / vNorm;
    const v3y = ((vx * Math.sin(R) + vy * Math.cos(R)) * SIZE) / vNorm;

    const v4x = ((vx * Math.cos(-R) - vy * Math.sin(-R)) * SIZE) / vNorm;
    const v4y = ((vx * Math.sin(-R) + vy * Math.cos(-R)) * SIZE) / vNorm;

    const p3 = Point.model(p1.x + v3x, p1.y + v3y);
    const p4 = Point.model(p1.x + v4x, p1.y + v4y);

    return [p3, p4];
}

export function adjustLineEdgePoints(
    line: LineEntity,
    linkedEntity1: Entity | undefined,
    linkedEntity2: Entity | undefined
): [ModelCordPoint, ModelCordPoint] {
    let { p1, p2 } = line;
    if (linkedEntity1 !== undefined) {
        const box = Entity.getBoundingBox(linkedEntity1);
        const linkedEntity1p11 = box.point;
        const linkedEntity1p12 = Point.model(box.point.x, box.point.y + box.size.height);
        const linkedEntity1p21 = Point.model(box.point.x + box.size.width, box.point.y);
        const linkedEntity1p22 = Point.model(box.point.x + box.size.width, box.point.y + box.size.height);
        p1 =
            getLineIntersectPoint(p1, p2, linkedEntity1p11, linkedEntity1p12) ??
            getLineIntersectPoint(p1, p2, linkedEntity1p12, linkedEntity1p22) ??
            getLineIntersectPoint(p1, p2, linkedEntity1p22, linkedEntity1p21) ??
            getLineIntersectPoint(p1, p2, linkedEntity1p21, linkedEntity1p11) ??
            p1;
    }
    if (linkedEntity2 !== undefined) {
        const box = Entity.getBoundingBox(linkedEntity2);
        const linkedEntity2p11 = box.point;
        const linkedEntity2p12 = Point.model(box.point.x, box.point.y + box.size.height);
        const linkedEntity2p21 = Point.model(box.point.x + box.size.width, box.point.y);
        const linkedEntity2p22 = Point.model(box.point.x + box.size.width, box.point.y + box.size.height);
        p2 =
            getLineIntersectPoint(p1, p2, linkedEntity2p11, linkedEntity2p12) ??
            getLineIntersectPoint(p1, p2, linkedEntity2p12, linkedEntity2p22) ??
            getLineIntersectPoint(p1, p2, linkedEntity2p22, linkedEntity2p21) ??
            getLineIntersectPoint(p1, p2, linkedEntity2p21, linkedEntity2p11) ??
            p2;
    }

    return [p1, p2];
}
