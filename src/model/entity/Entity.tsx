import { Box } from '../Box';
import { LineEntity } from './LineEntity';
import { RectEntity } from './RectEntity';
import { TextEntity } from './TextEntity';

export type Entity = RectEntity | TextEntity | LineEntity;

export module Entity {
    export function getBoundingBox(entity: Entity): Box {
        switch (entity.type) {
            case 'rect':
            case 'text':
            case 'line':
                return {
                    x: Math.min(entity.point.x, entity.point.x + entity.width),
                    y: Math.min(entity.point.y, entity.point.y + entity.height),
                    width: Math.abs(entity.width),
                    height: Math.abs(entity.height),
                };
        }
    }
}
