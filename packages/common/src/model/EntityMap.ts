import { Entity } from './page/entity/Entity';
import { Box, ModelCordBox } from './Box';
import { Record } from './Record';

export type EntityMap = {
    [entityId: string]: Entity;
};

export module EntityMap {
    export function filterByRange(entities: EntityMap, range: ModelCordBox): EntityMap {
        return Record.filter(entities, (entity) => Box.isOverlap(range, Entity.getBoundingBox(entity)));
    }
}
