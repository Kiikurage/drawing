import { Box, Camera, Entity, EntityMap, ModelCordBox, Record } from '@drawing/common';

export function computeVisibleEntities(entities: EntityMap, camera: Camera): EntityMap {
    const viewport = Box.toModel(camera, Box.display(0, 0, window.innerWidth, window.innerHeight));

    return filterEntitiesByRange(entities, viewport);
}

export function filterEntitiesByRange(entities: EntityMap, range: ModelCordBox): EntityMap {
    return Record.filter(entities, (entity) => Box.isOverlap(range, Entity.getBoundingBox(entity)));
}
