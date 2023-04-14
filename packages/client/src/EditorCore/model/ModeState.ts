import { Patch } from '@drawing/common/src/model/Patch';

export interface ModeState {
    mode: string;
}

export module ModeState {
    export function create(initialData: Patch<ModeState> = {}) {
        return Patch.apply<ModeState>({ mode: 'select' }, initialData);
    }
}
