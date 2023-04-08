import { randomId } from '../../../lib/randomId';
import { ColorPaletteKey } from '../../ColorPalette';
import { Transform } from '../../Transform';
import { ModelCordBox } from '../../Box';
import { Patch } from '../../Patch';
import { ModelCordPoint, Point } from '../../Point';
import { ModelCordSize, Size } from '../../Size';
import { HorizontalAlign, VerticalAlign } from '../../TextAlign';

export interface TextEntity {
    id: string;
    type: 'text';
    p1: ModelCordPoint;
    palette: ColorPaletteKey;
    size: ModelCordSize | null;
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
                palette: 'BLACK',
                size: null,
                contentSize: Size.model(1, 1),
                text: '',
                horizontalAlign: 'left',
                verticalAlign: 'top',
            },
            data
        );
    }

    export function getBoundingBox(entity: TextEntity): ModelCordBox {
        const size = Size.model(
            Math.max(entity.size?.width ?? 0, entity.contentSize.width),
            Math.max(entity.size?.height ?? 0, entity.contentSize.height)
        );
        return {
            point: Point.model(
                Math.min(entity.p1.x, entity.p1.x + size.width),
                Math.min(entity.p1.y, entity.p1.y + size.height)
            ),
            size,
        };
    }

    export function transform(entity: TextEntity, transform: Transform): Patch<TextEntity> {
        const box = getBoundingBox(entity);

        const prevP2 = Point.model(entity.p1.x + box.size.width, entity.p1.y + box.size.height);
        const nextP1 = transform.apply(entity.p1);
        const nextP2 = transform.apply(prevP2);
        const nextSize = Size.model(nextP2.x - nextP1.x, nextP2.y - nextP1.y);

        if (nextSize.width < 0) {
            nextSize.width *= -1;
            nextP1.x -= nextSize.width;
        }
        if (nextSize.height < 0) {
            nextSize.height *= -1;
            nextP1.y -= nextSize.height;
        }

        return { p1: nextP1, size: nextSize };
    }

    export function isTextEditable(): boolean {
        return true;
    }

    export function includes(entity: TextEntity, point: ModelCordPoint): boolean {
        const box = getBoundingBox(entity);
        return (
            box.point.x <= point.x &&
            point.x <= box.point.x + box.size.width &&
            box.point.y <= point.y &&
            point.y <= box.point.y + box.size.height
        );
    }
}
