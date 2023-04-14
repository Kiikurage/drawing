import { Patch } from '@drawing/common';

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
