import { randomId } from '../../../lib/randomId';
import { ColorPaletteKey } from '../../ColorPalette';
import { Box, ModelCordBox } from '../../Box';
import { Patch } from '../../Patch';
import { ModelCordPoint, Point } from '../../Point';
import { HorizontalAlign, VerticalAlign } from '../../TextAlign';
import { EntityDelegates } from './Entity';
import { Transform } from '../../Transform';
import { ModelCordSize, Size } from '../../Size';

export interface PolygonEntity {
    id: string;
    type: 'polygon';
    p1: ModelCordPoint;
    size: ModelCordSize;
    palette: ColorPaletteKey;
    text: string;
    zIndex: number;
    points: ModelCordPoint[];
    horizontalAlign: HorizontalAlign;
    verticalAlign: VerticalAlign;
}

export module PolygonEntity {
    export function create(data: Patch<Omit<PolygonEntity, 'type' | 'id'>> = {}): PolygonEntity {
        return Patch.apply<PolygonEntity>(
            {
                id: randomId(),
                type: 'polygon',
                points: [Point.model(0, 0), Point.model(0, 1), Point.model(1, 1), Point.model(1, 0)],
                p1: Point.model(0, 0),
                text: '',
                zIndex: 0,
                size: Size.model(1, 1),
                palette: 'BLACK',
                horizontalAlign: 'center',
                verticalAlign: 'center',
            },
            data
        );
    }
}

export const PolygonEntityDelegate: EntityDelegates<PolygonEntity> = {
    getBoundingBox(entity: PolygonEntity): ModelCordBox {
        return Box.model(entity.p1.x, entity.p1.y, entity.size.width, entity.size.height);
    },
    transform(entity: PolygonEntity, transform: Transform): Patch<PolygonEntity> {
        const newBox = transform.apply(PolygonEntityDelegate.getBoundingBox(entity));

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
    includes(entity: PolygonEntity, point: ModelCordPoint): boolean {
        return Box.includes(PolygonEntityDelegate.getBoundingBox(entity), point);
    },
};
