import { Patch } from '../../../model/Patch';

export interface TextEditModeState {
    entityId: string;
}

export module TextEditModeState {
    export function create(initialData: Patch<TextEditModeState> = {}) {
        return Patch.apply<TextEditModeState>({ entityId: '' }, initialData);
    }
}
