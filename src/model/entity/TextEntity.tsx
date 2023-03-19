import { ModelCordBox } from '../Box';
import { Patch } from '../Patch';
import { ModelCordPoint, Point } from '../Point';
import { ModelCordSize, Size } from '../Size';
import { EntityDelegates } from './Entity';

export interface TextEntity {
    id: string;
    type: 'text';
    p1: ModelCordPoint;

    size: ModelCordSize;
    value: string;
}

export module TextEntity {
    export function create(data: Patch<Omit<TextEntity, 'type' | 'id'>>): TextEntity {
        return Patch.apply<TextEntity>(
            {
                id: `${performance.now()}`,
                type: 'text' as const,
                p1: Point.model({ x: 0, y: 0 }),
                size: Size.model({ width: 100, height: 100 }),
                value: 'Hello World!',
            },
            data
        );
    }
}

export const TextEntityDelegate: EntityDelegates<TextEntity> = {
    getBoundingBox(entity: TextEntity): ModelCordBox {
        return {
            point: Point.model({
                x: Math.min(entity.p1.x, entity.p1.x + entity.size.width),
                y: Math.min(entity.p1.y, entity.p1.y + entity.size.height),
            }),
            size: Size.model({
                width: Math.abs(entity.size.width),
                height: Math.abs(entity.size.height),
            }),
        };
    },
    transform(entity: TextEntity, prevBoundingBox: ModelCordBox, nextBoundingBox: ModelCordBox): TextEntity {
        const scaleX = nextBoundingBox.size.width / prevBoundingBox.size.width;
        const scaleY = nextBoundingBox.size.height / prevBoundingBox.size.height;

        const nextEntity = Patch.apply(entity, {
            p1: {
                x: (entity.p1.x - prevBoundingBox.point.x) * scaleX + nextBoundingBox.point.x,
                y: (entity.p1.y - prevBoundingBox.point.y) * scaleY + nextBoundingBox.point.y,
            },
            size: {
                width: Math.abs(entity.size.width * scaleX),
                height: Math.abs(entity.size.height * scaleY),
            },
        });

        if (scaleX < 0) {
            nextEntity.p1.x -= nextEntity.size.width;
        }
        if (scaleY < 0) {
            nextEntity.p1.y -= nextEntity.size.height;
        }

        return nextEntity;
    },
};
