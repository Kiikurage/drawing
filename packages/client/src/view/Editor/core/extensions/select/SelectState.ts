import { EntityMap, Patch } from '@drawing/common';

export interface SelectModeState {
    entities: EntityMap;
}

export module SelectState {
    export function create(initialData: Patch<SelectModeState> = {}) {
        return Patch.apply<SelectModeState>(
            {
                entities: {},
            },
            initialData
        );
    }
}
