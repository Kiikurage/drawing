import { Record } from '../../lib/Record';
import { Box, ModelCordBox } from '../../model/Box';
import { Entity } from '../../model/entity/Entity';
import { Camera } from './model/Camera';
import { EntityMap } from './model/EntityMap';

export function computeVisibleEntities(entities: EntityMap, camera: Camera): EntityMap {
    const viewport = Box.toModel(camera, Box.display(0, 0, window.innerWidth, window.innerHeight));

    return filterEntitiesByRange(entities, viewport);
}

export function filterEntitiesByRange(entities: EntityMap, range: ModelCordBox): EntityMap {
    return Record.filter(entities, (entity) => Box.isOverlap(range, Entity.getBoundingBox(entity)));
}
