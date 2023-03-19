import { Box } from '../Box';
import { LineEntity } from './LineEntity';
import { RectEntity } from './RectEntity';
import { TextEntity } from './TextEntity';

export type Entity = RectEntity | TextEntity | LineEntity;

export module Entity {
    export function getBoundingBox(entity: Entity): Box {
        switch (entity.type) {
            case 'rect':
                return RectEntity.getBoundingBox(entity);
            case 'text':
                return TextEntity.getBoundingBox(entity);
            case 'line':
                return LineEntity.getBoundingBox(entity);
        }
    }

    export function transform(entity: Entity, prevBoundingBox: Box, nextBoundingBox: Box): Entity {
        switch (entity.type) {
            case 'rect':
                return RectEntity.transform(entity, prevBoundingBox, nextBoundingBox);
            case 'text':
                return TextEntity.transform(entity, prevBoundingBox, nextBoundingBox);
            case 'line':
                return LineEntity.transform(entity, prevBoundingBox, nextBoundingBox);
        }
    }
}
