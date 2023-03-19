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
            const box = Entity.getBoundingBox(entity);
            x0 = Math.min(box.x, x0);
            y0 = Math.min(box.y, y0);
            x1 = Math.max(box.x + box.width, x1);
            y1 = Math.max(box.y + box.height, y1);
        }
        const width = x1 - x0;
        const height = y1 - y0;

        return { x: x0, y: y0, width, height };
    }
}
