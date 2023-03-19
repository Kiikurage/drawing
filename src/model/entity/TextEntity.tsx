import { Box } from '../Box';
import { ModelCordPoint } from '../Point';

export interface TextEntity {
    id: string;
    type: 'text';
    p1: ModelCordPoint;

    width: number;

    height: number;
    value: string;
}

export module TextEntity {
    export function create(initialData: Partial<Omit<TextEntity, 'type'>>): TextEntity {
        return {
            id: `${performance.now()}`,
            type: 'text' as const,
            p1: ModelCordPoint({ x: 0, y: 0 }),
            width: 100,
            height: 100,
            value: 'Hello World!',
            ...initialData,
        };
    }

    export function getBoundingBox(entity: TextEntity): Box {
        return {
            x: Math.min(entity.p1.x, entity.p1.x + entity.width),
            y: Math.min(entity.p1.y, entity.p1.y + entity.height),
            width: Math.abs(entity.width),
            height: Math.abs(entity.height),
        };
    }

    export function transform(entity: TextEntity, prevBoundingBox: Box, nextBoundingBox: Box): TextEntity {
        const scaleX = nextBoundingBox.width / prevBoundingBox.width;
        const scaleY = nextBoundingBox.height / prevBoundingBox.height;

        const nextEntity: TextEntity = {
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
