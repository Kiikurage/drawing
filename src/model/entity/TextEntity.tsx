import { getClosestValue } from '../../lib/getClosestValue';
import { randomId } from '../../lib/randomId';
import { ColorPaletteKey } from '../../view/Editor/model/ColorPalette';
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
    value: string;
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
                value: 'Hello World!',
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
    transform(entity: TextEntity, prevBoundingBox: ModelCordBox, nextBoundingBox: ModelCordBox): Patch<TextEntity> {
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
};
