import { Record } from '../../lib/Record';
import { Box } from '../../model/Box';
import { Entity } from '../../model/entity/Entity';
import { Camera } from './model/Camera';
import { EntityMap } from './model/EntityMap';

export function computeVisibleEntities(entities: EntityMap, camera: Camera): EntityMap {
    const viewport = Box.toModel(camera, Box.display(0, 0, window.innerWidth, window.innerHeight));

    return Record.filter(entities, (entity) => Box.isOverlap(viewport, Entity.getBoundingBox(entity)));
}
