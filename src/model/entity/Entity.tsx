import { EntityMap } from '../../view/Editor/model/EntityMap';
import { Transform } from '../../view/Editor/model/Transform';
import { ModelCordBox } from '../Box';
import { Patch } from '../Patch';
import { ModelCordPoint, Point } from '../Point';
import { Size } from '../Size';
import { LineEntity, LineEntityDelegate } from './LineEntity';
import { RectEntity, RectEntityDelegate } from './RectEntity';
import { TextEntity } from './TextEntity';

export type Entity = RectEntity | TextEntity | LineEntity;

export interface EntityDelegates<T extends Entity> {
    getBoundingBox(entity: T): ModelCordBox;

    transform(entity: T, transform: Transform): Patch<T>;

    isTextEditable(entity: T): boolean;

    includes(entity: T, point: ModelCordPoint): boolean;
}

export module Entity {
    const delegates: Record<Entity['type'], EntityDelegates<Entity>> = {
        rect: RectEntityDelegate,
        text: TextEntity,
        line: LineEntityDelegate,
    };

    function getDelegate<T extends Entity>(entity: T): EntityDelegates<T> {
        return delegates[entity.type] as EntityDelegates<T>;
    }

    export function getBoundingBox(entity: Entity): ModelCordBox {
        return getDelegate(entity).getBoundingBox(entity);
    }

    export function computeBoundingBox(entities: EntityMap): ModelCordBox {
        let x0 = +Infinity,
            y0 = +Infinity,
            x1 = -Infinity,
            y1 = -Infinity;

        for (const entity of Object.values(entities)) {
            const box = Entity.getBoundingBox(entity);
            x0 = Math.min(box.point.x, x0);
            y0 = Math.min(box.point.y, y0);
            x1 = Math.max(box.point.x + box.size.width, x1);
            y1 = Math.max(box.point.y + box.size.height, y1);
        }
        const width = x1 - x0;
        const height = y1 - y0;

        return { point: Point.model(x0, y0), size: Size.model(width, height) };
    }

    export function includes(entity: Entity, point: ModelCordPoint): boolean {
        return getDelegate(entity).includes(entity, point);
    }

    export function transform(entity: Entity, transform: Transform): Patch<Entity> {
        return getDelegate(entity).transform(entity, transform);
    }

    export function isTextEditable(entity: Entity): boolean {
        return getDelegate(entity).isTextEditable(entity);
    }
}
