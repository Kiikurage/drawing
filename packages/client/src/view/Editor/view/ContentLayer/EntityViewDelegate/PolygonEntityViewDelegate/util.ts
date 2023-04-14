import { PolygonEntity } from '@drawing/common';

export function createPath(entity: PolygonEntity) {
    const {
        points,
        size: { width, height },
    } = entity;
    const parts = [`M${points[0].x * width} ${points[0].y * height}`];

    for (const { x, y } of points.slice(1)) {
        parts.push(`L${x * width} ${y * height}`);
    }
    parts.push('Z');

    return parts.join('');
}
