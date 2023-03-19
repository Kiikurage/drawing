import { Box } from '../Box';
import { ModelCordPoint } from '../Point';

export interface LineEntity {
    id: string;
    type: 'line';
    p1: ModelCordPoint;
    p2: ModelCordPoint;
    strokeColor: string;
}

export module LineEntity {
    export function create(data: Partial<Omit<LineEntity, 'type'>>): LineEntity {
        return {
            id: `${performance.now()}`,
            type: 'line',
            p1: ModelCordPoint({ x: 0, y: 0 }),
            p2: ModelCordPoint({ x: 100, y: 100 }),
            strokeColor: '#000',
            ...data,
        };
    }

    export function getBoundingBox(entity: LineEntity): Box {
        return {
            x: Math.min(entity.p1.x, entity.p2.x),
            y: Math.min(entity.p1.y, entity.p2.y),
            width: Math.abs(entity.p1.x - entity.p2.x),
            height: Math.abs(entity.p1.y - entity.p2.y),
        };
    }

    export function transform(entity: LineEntity, prevBoundingBox: Box, nextBoundingBox: Box): LineEntity {
        const scaleX = nextBoundingBox.width / prevBoundingBox.width;
        const scaleY = nextBoundingBox.height / prevBoundingBox.height;

        return {
            ...entity,
            p1: ModelCordPoint({
                x: (entity.p1.x - prevBoundingBox.x) * scaleX + nextBoundingBox.x,
                y: (entity.p1.y - prevBoundingBox.y) * scaleY + nextBoundingBox.y,
            }),
            p2: ModelCordPoint({
                x: (entity.p2.x - prevBoundingBox.x) * scaleX + nextBoundingBox.x,
                y: (entity.p2.y - prevBoundingBox.y) * scaleY + nextBoundingBox.y,
            }),
        };
    }
}
