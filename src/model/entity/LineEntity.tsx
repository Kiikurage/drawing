import { getClosestValue } from '../../lib/getClosestValue';
import { randomId } from '../../lib/randomId';
import { ColorPaletteKey } from '../../view/Editor/model/ColorPalette';
import { ModelCordBox } from '../Box';
import { Patch } from '../Patch';
import { ModelCordPoint, Point } from '../Point';
import { Size } from '../Size';
import { EntityDelegates } from './Entity';

export interface LineEntity {
    id: string;
    type: 'line';
    p1: ModelCordPoint;
    palette: ColorPaletteKey;
    p2: ModelCordPoint;
    linkedEntityId1?: string;
    linkedEntityId2?: string;
}

export module LineEntity {
    export function create(data: Patch<Omit<LineEntity, 'type' | 'id'>> = {}): LineEntity {
        return Patch.apply<LineEntity>(
            {
                id: randomId(),
                type: 'line',
                p1: Point.model(0, 0),
                p2: Point.model(100, 100),
                palette: 'BLACK',
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
    transform(entity: LineEntity, prevBoundingBox: ModelCordBox, nextBoundingBox: ModelCordBox): Patch<LineEntity> {
        const scaleX = nextBoundingBox.size.width / prevBoundingBox.size.width;
        const scaleY = nextBoundingBox.size.height / prevBoundingBox.size.height;

        return {
            p1: Point.model(
                (entity.p1.x - prevBoundingBox.point.x) * scaleX + nextBoundingBox.point.x,
                (entity.p1.y - prevBoundingBox.point.y) * scaleY + nextBoundingBox.point.y
            ),
            p2: Point.model(
                (entity.p2.x - prevBoundingBox.point.x) * scaleX + nextBoundingBox.point.x,
                (entity.p2.y - prevBoundingBox.point.y) * scaleY + nextBoundingBox.point.y
            ),
        };
    },
    getSnap(entity: LineEntity, offset: number, direction: 'x' | 'y'): number {
        if (direction === 'x') {
            return getClosestValue([entity.p1.x, (entity.p1.x + entity.p2.x) / 2, entity.p2.x], offset);
        } else {
            return getClosestValue([entity.p1.y, (entity.p1.y + entity.p2.y) / 2, entity.p2.y], offset);
        }
    },
    isTextEditable(): boolean {
        return false;
    },
    includes(): boolean {
        return false;
    },
};
