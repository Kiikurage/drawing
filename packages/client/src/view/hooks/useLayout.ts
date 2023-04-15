import { useEntityMap } from './useEntityMap';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { nonNull } from '@drawing/common/src/lib/nonNull';
import { FractionalKey } from '@drawing/common/src/model/FractionalKey';

export function useLayout(): Entity[] {
    const entities = Object.values(useEntityMap()).filter(nonNull);

    return entities.sort((e1, e2) => FractionalKey.comparator(e1.orderKey, e2.orderKey));
}
