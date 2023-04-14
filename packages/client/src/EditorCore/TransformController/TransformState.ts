import { Patch } from '@drawing/common';

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
