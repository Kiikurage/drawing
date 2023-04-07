import { Patch } from '@drawing/common/src/model/Patch';

export interface SnapState {
    enabled: boolean;
    visible: boolean;
}

export module SnapState {
    export function create(initialData: Patch<SnapState> = {}) {
        return Patch.apply<SnapState>(
            {
                enabled: false,
                visible: false,
            },
            initialData
        );
    }
}
