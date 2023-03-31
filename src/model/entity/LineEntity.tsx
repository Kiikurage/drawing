import { randomId } from '../../lib/randomId';
import { ColorPaletteKey } from '../../view/Editor/model/ColorPalette';
import { Transform } from '../../view/Editor/model/Transform';
import { ModelCordBox } from '../Box';
import { Patch } from '../Patch';
import { ModelCordPoint, Point } from '../Point';
import { Size } from '../Size';
import { Entity, EntityDelegates } from './Entity';
import { ArrowHeadType } from '../ArrowHeadType';

export interface LineEntity {
    id: string;
    type: 'line';
    p1: ModelCordPoint;
    palette: ColorPaletteKey;
    p2: ModelCordPoint;
    label: string;
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
                p2: Point.model(100, 100),
                label: '',
                palette: 'BLACK',
                linkedEntityId1: null,
                linkedEntityId2: null,
                arrowHeadType1: 'none',
                arrowHeadType2: 'arrow',
            },
            data
        );
    }

    export function isLine(entity: Entity): entity is LineEntity {
        return entity.type === 'line';
    }
}

export const LineEntityDelegate: EntityDelegates<LineEntity> = {
    getBoundingBox(entity: LineEntity): ModelCordBox {
        return {
            point: Point.model(Math.min(entity.p1.x, entity.p2.x), Math.min(entity.p1.y, entity.p2.y)),
            size: Size.model(Math.abs(entity.p1.x - entity.p2.x), Math.abs(entity.p1.y - entity.p2.y)),
        };
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
    includes(): boolean {
        return false;
    },
};
