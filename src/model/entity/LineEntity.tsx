import { uuid } from '../../lib/uuid';
import { ModelCordBox } from '../Box';
import { Patch } from '../Patch';
import { ModelCordPoint, Point } from '../Point';
import { Size } from '../Size';
import { EntityDelegates } from './Entity';

export interface LineEntity {
    id: string;
    type: 'line';
    p1: ModelCordPoint;
    p2: ModelCordPoint;
    strokeColor: string;
}

export module LineEntity {
    export function create(data: Patch<Omit<LineEntity, 'type' | 'id'>>): LineEntity {
        return Patch.apply<LineEntity>(
            {
                id: uuid(),
                type: 'line',
                p1: Point.model({ x: 0, y: 0 }),
                p2: Point.model({ x: 100, y: 100 }),
                strokeColor: '#000',
            },
            data
        );
    }
}

export const LineEntityDelegate: EntityDelegates<LineEntity> = {
    getBoundingBox(entity: LineEntity): ModelCordBox {
        return {
            point: Point.model({
                x: Math.min(entity.p1.x, entity.p2.x),
                y: Math.min(entity.p1.y, entity.p2.y),
            }),
            size: Size.model({
                width: Math.abs(entity.p1.x - entity.p2.x),
                height: Math.abs(entity.p1.y - entity.p2.y),
            }),
        };
    },
    transform(entity: LineEntity, prevBoundingBox: ModelCordBox, nextBoundingBox: ModelCordBox): LineEntity {
        const scaleX = nextBoundingBox.size.width / prevBoundingBox.size.width;
        const scaleY = nextBoundingBox.size.height / prevBoundingBox.size.height;

        return Patch.apply(entity, {
            p1: Point.model({
                x: (entity.p1.x - prevBoundingBox.point.x) * scaleX + nextBoundingBox.point.x,
                y: (entity.p1.y - prevBoundingBox.point.y) * scaleY + nextBoundingBox.point.y,
            }),
            p2: Point.model({
                x: (entity.p2.x - prevBoundingBox.point.x) * scaleX + nextBoundingBox.point.x,
                y: (entity.p2.y - prevBoundingBox.point.y) * scaleY + nextBoundingBox.point.y,
            }),
        });
    },
};
