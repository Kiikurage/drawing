import { randomId } from '../../lib/randomId';
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
                id: randomId(),
                type: 'line',
                p1: Point.model(0, 0),
                p2: Point.model(100, 100),
                strokeColor: '#000',
            },
            data
        );
    }
}

export const LineEntityDelegate: EntityDelegates<LineEntity> = {
    getBoundingBox(entity: LineEntity): ModelCordBox {
        return {
            point: Point.model(Math.min(entity.p1.x, entity.p2.x), Math.min(entity.p1.y, entity.p2.y)),
            size: Size.model(Math.abs(entity.p1.x - entity.p2.x), Math.abs(entity.p1.y - entity.p2.y)),
        };
    },
    transform(entity: LineEntity, prevBoundingBox: ModelCordBox, nextBoundingBox: ModelCordBox): LineEntity {
        const scaleX = nextBoundingBox.size.width / prevBoundingBox.size.width;
        const scaleY = nextBoundingBox.size.height / prevBoundingBox.size.height;

        return Patch.apply(entity, {
            p1: Point.model(
                (entity.p1.x - prevBoundingBox.point.x) * scaleX + nextBoundingBox.point.x,
                (entity.p1.y - prevBoundingBox.point.y) * scaleY + nextBoundingBox.point.y
            ),
            p2: Point.model(
                (entity.p2.x - prevBoundingBox.point.x) * scaleX + nextBoundingBox.point.x,
                (entity.p2.y - prevBoundingBox.point.y) * scaleY + nextBoundingBox.point.y
            ),
        });
    },
};
