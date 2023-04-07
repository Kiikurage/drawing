import { Patch } from '@drawing/common/src/model/Patch';
import { SelectExtension } from '../../core/extensions/select/SelectExtension';

export interface ModeState {
    mode: string;
}

export module ModeState {
    export function create(initialData: Patch<ModeState> = {}) {
        return Patch.apply<ModeState>({ mode: SelectExtension.MODE_KEY }, initialData);
    }
}
