import { Patch } from '@drawing/common/build/model/Patch';

export interface ModeState {
    mode: string;
}

export module ModeState {
    export function create(initialData: Patch<ModeState> = {}) {
        return Patch.apply<ModeState>({ mode: 'select' }, initialData);
    }
}
