import { randomId } from '../../../lib/randomId';
import { ColorPaletteKey } from '../../ColorPalette';
import { Transform } from '../../Transform';
import { Box, ModelCordBox } from '../../Box';
import { Patch } from '../../Patch';
import { ModelCordPoint, Point } from '../../Point';
import { EntityDelegates } from './Entity';
import { ArrowHeadType } from '../../ArrowHeadType';

export interface LineEntity {
    id: string;
    type: 'line';
    p1: ModelCordPoint;
    palette: ColorPaletteKey;
    zIndex: number;
    p2: ModelCordPoint;
    text: string;
    linkedEntityId1: string | null;
    linkedEntityId2: string | null;
    arrowHeadType1: ArrowHeadType;
    arrowHeadType2: ArrowHeadType;
}

export module LineEntity {
    export function create(data: Patch<Omit<LineEntity, 'type' | 'id'>> = {}): LineEntity {
        return Patch.apply<LineEntity>(
            {
                id: randomId(),
                type: 'line',
                p1: Point.model(0, 0),
                p2: Point.model(1, 1),
                zIndex: 0,
                text: '',
                palette: 'BLACK',
                linkedEntityId1: null,
                linkedEntityId2: null,
                arrowHeadType1: 'none',
                arrowHeadType2: 'arrow',
            },
            data
        );
    }
}

export const LineEntityDelegate: EntityDelegates<LineEntity> = {
    getBoundingBox(entity: LineEntity): ModelCordBox {
        return Box.fromPoints(entity.p1, entity.p2);
    },
    transform(entity: LineEntity, transform: Transform): Patch<LineEntity> {
        return {
            p1: transform.apply(entity.p1),
            p2: transform.apply(entity.p2),
        };
    },
    isTextEditable(): boolean {
        return true;
    },
    includes(entity: LineEntity, point: ModelCordPoint): boolean {
        return false;
    },
};
