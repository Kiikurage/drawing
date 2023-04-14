import { useEntityMap } from './useEntityMap';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { nonNull } from '@drawing/common/src/lib/nonNull';

export function useLayout(): Entity[] {
    const entities = Object.values(useEntityMap()).filter(nonNull);

    return entities.sort((e1, e2) => e1.zIndex - e2.zIndex);
}
