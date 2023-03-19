import { Box } from '../Box';
import { ModelCordPoint } from '../Point';

export interface RectEntity {
    id: string;
    type: 'rect';
    p1: ModelCordPoint;
    width: number;
    height: number;
    strokeColor: string;
    fillColor: string;
}

export module RectEntity {
    export function create(data: Partial<Omit<RectEntity, 'type'>>): RectEntity {
        return {
            id: `${performance.now()}`,
            type: 'rect',
            p1: ModelCordPoint({ x: 0, y: 0 }),
            width: 100,
            height: 100,
            strokeColor: '#000',
            fillColor: 'transparent',
            ...data,
        };
    }

    export function getBoundingBox(entity: RectEntity): Box {
        return {
            x: Math.min(entity.p1.x, entity.p1.x + entity.width),
            y: Math.min(entity.p1.y, entity.p1.y + entity.height),
            width: Math.abs(entity.width),
            height: Math.abs(entity.height),
        };
    }

    export function transform(entity: RectEntity, prevBoundingBox: Box, nextBoundingBox: Box): RectEntity {
        const scaleX = nextBoundingBox.width / prevBoundingBox.width;
        const scaleY = nextBoundingBox.height / prevBoundingBox.height;

        const nextEntity: RectEntity = {
            ...entity,
            p1: ModelCordPoint({
                x: (entity.p1.x - prevBoundingBox.x) * scaleX + nextBoundingBox.x,
                y: (entity.p1.y - prevBoundingBox.y) * scaleY + nextBoundingBox.y,
            }),
            width: Math.abs(entity.width * scaleX),
            height: Math.abs(entity.height * scaleY),
        };

        if (scaleX < 0) {
            nextEntity.p1.x -= nextEntity.width;
        }
        if (scaleY < 0) {
            nextEntity.p1.y -= nextEntity.height;
        }

        return nextEntity;
    }
}
