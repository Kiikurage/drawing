import { Transform } from '../../Transform';
import { ModelCordBox } from '../../Box';
import { Patch } from '../../Patch';
import { ModelCordPoint, Point } from '../../Point';
import { Size } from '../../Size';
import { LineEntity, LineEntityDelegate } from './LineEntity';
import { PolygonEntity, PolygonEntityDelegate } from './PolygonEntity';
import { TextEntity, TextEntityDelegate } from './TextEntity';

export type Entity = PolygonEntity | TextEntity | LineEntity;

export interface EntityDelegates<T extends Entity> {
    getBoundingBox(entity: T): ModelCordBox;

    transform(entity: T, transform: Transform): Patch<T>;

    isTextEditable(entity: T): boolean;

    includes(entity: T, point: ModelCordPoint): boolean;
}

export module Entity {
    const delegates: Record<Entity['type'], EntityDelegates<Entity>> = {
        polygon: PolygonEntityDelegate,
        text: TextEntityDelegate,
        line: LineEntityDelegate,
    };

    function getDelegate<T extends Entity>(entity: T): EntityDelegates<T> {
        return delegates[entity.type] as EntityDelegates<T>;
    }

    export function getBoundingBox(entity: Entity): ModelCordBox {
        return getDelegate(entity).getBoundingBox(entity);
    }

    export function computeBoundingBox(entities: Entity[]): ModelCordBox {
        let x0 = +Infinity,
            y0 = +Infinity,
            x1 = -Infinity,
            y1 = -Infinity;

        for (const entity of entities) {
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

    export function distributeHorizontally(entities: Entity[]): Record<string, Patch<Entity>> {
        if (entities.length <= 1) return {};

        const boundingBox = Entity.computeBoundingBox(entities);
        const entityAndBox = entities
            .map((entity) => ({ entity, box: Entity.getBoundingBox(entity) }))
            .sort(({ box: box1 }, { box: box2 }) => box1.point.x - box2.point.x);

        const totalWidth = boundingBox.size.width;
        const sumEntityWidth = entityAndBox.reduce((sum, entry) => sum + entry.box.size.width, 0);

        const gap = (totalWidth - sumEntityWidth) / (entities.length - 1);

        let x = boundingBox.point.x;
        const patches: Record<string, Patch<Entity>> = {};
        const inversePatches: Record<string, Patch<Entity>> = {};

        for (const { entity, box } of entityAndBox) {
            patches[entity.id] = { p1: { x } };
            inversePatches[entity.id] = { p1: { x: entity.p1.x } };
            x += box.size.width + gap;
        }

        return patches;
    }

    export function distributeVertically(entities: Entity[]): Record<string, Patch<Entity>> {
        if (entities.length <= 1) return {};

        const boundingBox = Entity.computeBoundingBox(entities);
        const entityAndBox = entities
            .map((entity) => ({ entity, box: Entity.getBoundingBox(entity) }))
            .sort(({ box: box1 }, { box: box2 }) => box1.point.y - box2.point.y);

        const totalHeight = boundingBox.size.height;
        const sumEntityHeight = entityAndBox.reduce((sum, entry) => sum + entry.box.size.height, 0);

        const gap = (totalHeight - sumEntityHeight) / (entities.length - 1);

        let y = boundingBox.point.y;
        const patches: Record<string, Patch<Entity>> = {};

        for (const { entity, box } of entityAndBox) {
            patches[entity.id] = { p1: { y } };
            y += box.size.height + gap;
        }

        return patches;
    }

    export function alignHorizontal(
        entities: Entity[],
        anchor: 'left' | 'center' | 'right'
    ): Record<string, Patch<Entity>> {
        if (entities.length <= 1) return {};

        const boundingBox = Entity.computeBoundingBox(entities);
        const patches: Record<string, Patch<Entity>> = {};
        const inversePatches: Record<string, Patch<Entity>> = {};
        for (const entity of entities) {
            let x: number;
            switch (anchor) {
                case 'left':
                    x = boundingBox.point.x;
                    break;
                case 'center':
                    x = boundingBox.point.x + boundingBox.size.width / 2 - Entity.getBoundingBox(entity).size.width / 2;
                    break;
                case 'right':
                    x = boundingBox.point.x + boundingBox.size.width - Entity.getBoundingBox(entity).size.width;
                    break;
            }

            patches[entity.id] = { p1: { x } };
            inversePatches[entity.id] = { p1: { x: entity.p1.x } };
        }

        return patches;
    }

    export function alignVertical(
        entities: Entity[],
        anchor: 'top' | 'center' | 'bottom'
    ): Record<string, Patch<Entity>> {
        if (entities.length <= 1) return {};

        const boundingBox = Entity.computeBoundingBox(entities);
        const patches: Record<string, Patch<Entity>> = {};
        const inversePatches: Record<string, Patch<Entity>> = {};
        for (const entity of entities) {
            let y: number;
            switch (anchor) {
                case 'top':
                    y = boundingBox.point.y;
                    break;
                case 'center':
                    y =
                        boundingBox.point.y +
                        boundingBox.size.height / 2 -
                        Entity.getBoundingBox(entity).size.height / 2;
                    break;
                case 'bottom':
                    y = boundingBox.point.y + boundingBox.size.height - Entity.getBoundingBox(entity).size.height;
                    break;
            }

            patches[entity.id] = { p1: { y } };
            inversePatches[entity.id] = { p1: { y: entity.p1.y } };
        }

        return patches;
    }
}
