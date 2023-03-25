import { Patch } from '../../../model/Patch';

export interface TextEditModeState {
    editing: boolean;
    entityId: string;
}

export module TextEditModeState {
    export function create(initialData: Patch<TextEditModeState> = {}) {
        return Patch.apply<TextEditModeState>({ editing: false, entityId: '' }, initialData);
    }
}
