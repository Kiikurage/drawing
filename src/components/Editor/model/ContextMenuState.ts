import { Patch } from '../../../model/Patch';
import { ModelCordPoint } from '../../../model/Point';

export interface ContextMenuState {
    p1: ModelCordPoint | null;
}

export module ContextMenuState {
    export function create(initialData: Patch<ContextMenuState> = {}) {
        return Patch.apply(
            {
                p1: null,
            },
            initialData
        );
    }
}
