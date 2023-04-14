import { randomId } from '../../../lib/randomId';
import { ColorPaletteKey } from '../../ColorPalette';
import { Transform } from '../../Transform';
import { Box, ModelCordBox } from '../../Box';
import { Patch } from '../../Patch';
import { ModelCordPoint, Point } from '../../Point';
import { ModelCordSize, Size } from '../../Size';
import { HorizontalAlign, VerticalAlign } from '../../TextAlign';
import { EntityDelegates } from './Entity';

export interface TextEntity {
    id: string;
    type: 'text';
    p1: ModelCordPoint;
    palette: ColorPaletteKey;
    size: ModelCordSize;
    zIndex: number;
    contentSize: ModelCordSize;
    text: string;
    horizontalAlign: HorizontalAlign;
    verticalAlign: VerticalAlign;
}

export module TextEntity {
    export function create(data: Patch<Omit<TextEntity, 'type' | 'id'>>): TextEntity {
        return Patch.apply<TextEntity>(
            {
                id: randomId(),
                type: 'text' as const,
                p1: Point.model(0, 0),
                text: '',
                size: Size.model(1, 1),
                zIndex: 0,
                palette: 'BLACK',
                contentSize: Size.model(1, 1),
                horizontalAlign: 'left',
                verticalAlign: 'top',
            },
            data
        );
    }
}

export const TextEntityDelegate: EntityDelegates<TextEntity> = {
    getBoundingBox(entity: TextEntity): ModelCordBox {
        return Box.model(entity.p1.x, entity.p1.y, entity.size.width, entity.size.height);
    },
    transform(entity: TextEntity, transform: Transform): Patch<TextEntity> {
        const newBox = transform.apply(TextEntityDelegate.getBoundingBox(entity));

        return {
            p1: {
                x: newBox.size.width < 0 ? newBox.point.x + newBox.size.width : newBox.point.x,
                y: newBox.size.height < 0 ? newBox.point.y + newBox.size.height : newBox.point.y,
            },
            size: {
                width: Math.abs(newBox.size.width),
                height: Math.abs(newBox.size.height),
            },
        };
    },
    isTextEditable(): boolean {
        return true;
    },
    includes(entity: TextEntity, point: ModelCordPoint): boolean {
        return Box.includes(TextEntityDelegate.getBoundingBox(entity), point);
    },
};
