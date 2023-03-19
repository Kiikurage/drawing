import { Entity } from './entity/Entity';
import { Point } from './Point';
import { Size } from './Size';

export interface Box extends Point, Size {}

export module Box {
    export function computeBoundingBox(entities: Entity[]) {
        let x0 = +Infinity,
            y0 = +Infinity,
            x1 = -Infinity,
            y1 = -Infinity;

        for (const entity of entities) {
            x0 = Math.min(entity.x, x0);
            y0 = Math.min(entity.y, y0);

            if (entity.type === 'rect') {
                x1 = Math.max(entity.x + entity.width, x1);
                y1 = Math.max(entity.y + entity.height, y1);
            }
        }
        const width = x1 - x0;
        const height = y1 - y0;

        return { x: x0, y: y0, width, height };
    }
}
