import { Patch } from '@drawing/common/src/model/Patch';

export interface TransformState {
    snapEnabled: boolean;
    snapGuideVisible: boolean;
    constraintsEnabled: boolean;
}

export module TransformState {
    export function create(initialData: Patch<TransformState> = {}) {
        return Patch.apply<TransformState>(
            {
                snapEnabled: false,
                snapGuideVisible: false,
                constraintsEnabled: false,
            },
            initialData
        );
    }
}
