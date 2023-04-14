import { useEntityMap } from './useEntityMap';
import { Entity, nonNull } from '@drawing/common';

export function useLayout(): Entity[] {
    const entities = Object.values(useEntityMap()).filter(nonNull);

    return entities.sort((e1, e2) => e1.zIndex - e2.zIndex);
}
