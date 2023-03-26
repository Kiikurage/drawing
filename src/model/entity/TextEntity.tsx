import { getClosestValue } from '../../lib/getClosestValue';
import { randomId } from '../../lib/randomId';
import { ColorPaletteKey } from '../../view/Editor/model/ColorPalette';
import { Transform } from '../../view/Editor/model/Transform';
import { ModelCordBox } from '../Box';
import { Patch } from '../Patch';
import { ModelCordPoint, Point } from '../Point';
import { ModelCordSize, Size } from '../Size';
import { EntityDelegates } from './Entity';

export interface TextEntity {
    id: string;
    type: 'text';
    p1: ModelCordPoint;
    palette: ColorPaletteKey;
    size: ModelCordSize;
    text: string;
}

export module TextEntity {
    export function create(data: Patch<Omit<TextEntity, 'type' | 'id'>>): TextEntity {
        return Patch.apply<TextEntity>(
            {
                id: randomId(),
                type: 'text' as const,
                p1: Point.model(0, 0),
                palette: 'BLACK',
                size: Size.model(100, 100),
                text: '',
            },
            data
        );
    }
}

export const TextEntityDelegate: EntityDelegates<TextEntity> = {
    getBoundingBox(entity: TextEntity): ModelCordBox {
        return {
            point: Point.model(
                Math.min(entity.p1.x, entity.p1.x + entity.size.width),
                Math.min(entity.p1.y, entity.p1.y + entity.size.height)
            ),
            size: Size.model(Math.abs(entity.size.width), Math.abs(entity.size.height)),
        };
    },
    transform(entity: TextEntity, transform: Transform): Patch<TextEntity> {
        const prevP2 = Point.model(entity.p1.x + entity.size.width, entity.p1.y + entity.size.height);
        const nextP1 = transform.apply(entity.p1);
        const nextP2 = transform.apply(prevP2);

        const patch = {
            p1: nextP1,
            size: Size.model(nextP2.x - nextP1.x, nextP2.y - nextP1.y),
        };

        if (patch.size.width < 0) {
            patch.size.width *= -1;
            patch.p1.x -= patch.size.width;
        }
        if (patch.size.height < 0) {
            patch.size.height *= -1;
            patch.p1.y -= patch.size.height;
        }

        return patch;
    },
    getSnap(entity: TextEntity, offset: number, direction: 'x' | 'y'): number {
        if (direction === 'x') {
            return getClosestValue(
                [entity.p1.x, entity.p1.x + entity.size.width / 2, entity.p1.x + entity.size.width],
                offset
            );
        } else {
            return getClosestValue(
                [entity.p1.y, entity.p1.y + entity.size.height / 2, entity.p1.y + entity.size.height],
                offset
            );
        }
    },
    isTextEditable(): boolean {
        return true;
    },
    includes(entity: TextEntity, point: ModelCordPoint): boolean {
        return (
            entity.p1.x <= point.x &&
            point.x <= entity.p1.x + entity.size.width &&
            entity.p1.y <= point.y &&
            point.y <= entity.p1.y + entity.size.height
        );
    },
};
