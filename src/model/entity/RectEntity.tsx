import { randomId } from '../../lib/randomId';
import { ModelCordBox } from '../Box';
import { Patch } from '../Patch';
import { ModelCordPoint, Point } from '../Point';
import { ModelCordSize, Size } from '../Size';
import { EntityDelegates } from './Entity';

export interface RectEntity {
    id: string;
    type: 'rect';
    p1: ModelCordPoint;

    size: ModelCordSize;
    strokeColor: string;
    fillColor: string;
}

export module RectEntity {
    export function create(data: Patch<Omit<RectEntity, 'type' | 'id'>> = {}): RectEntity {
        return Patch.apply<RectEntity>(
            {
                id: randomId(),
                type: 'rect',
                p1: Point.model(0, 0),
                size: Size.model(100, 100),
                strokeColor: '#000',
                fillColor: 'none',
            },
            data
        );
    }
}

export const RectEntityDelegate: EntityDelegates<RectEntity> = {
    getBoundingBox(entity: RectEntity): ModelCordBox {
        return {
            point: Point.model(
                Math.min(entity.p1.x, entity.p1.x + entity.size.width),
                Math.min(entity.p1.y, entity.p1.y + entity.size.height)
            ),
            size: Size.model(Math.abs(entity.size.width), Math.abs(entity.size.height)),
        };
    },
    transform(entity: RectEntity, prevBoundingBox: ModelCordBox, nextBoundingBox: ModelCordBox): Patch<RectEntity> {
        const scaleX = nextBoundingBox.size.width / prevBoundingBox.size.width;
        const scaleY = nextBoundingBox.size.height / prevBoundingBox.size.height;

        const patch = {
            p1: {
                x: (entity.p1.x - prevBoundingBox.point.x) * scaleX + nextBoundingBox.point.x,
                y: (entity.p1.y - prevBoundingBox.point.y) * scaleY + nextBoundingBox.point.y,
            },
            size: {
                width: Math.abs(entity.size.width * scaleX),
                height: Math.abs(entity.size.height * scaleY),
            },
        };

        if (scaleX < 0) {
            patch.p1.x -= patch.size.width;
        }
        if (scaleY < 0) {
            patch.p1.y -= patch.size.height;
        }

        return patch;
    },
};
