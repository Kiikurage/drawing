import { Patch } from '@drawing/common/src/model/Patch';

export interface ModeState {
    mode: string;
}

export module ModeState {
    export function create(initialValue: Partial<ModeState> = {}) {
        return Patch.apply(
            {
                mode: 'select',
            },
            initialValue
        );
    }
}
