import { Box, ModelCordBox, Patch } from '@drawing/common';

export interface SelectionState {
    selected: Record<string, boolean | undefined>;
    selecting: boolean;
    selectingRange: ModelCordBox;
}

export module SelectionState {
    export function create(initialData: Patch<SelectionState> = {}) {
        return Patch.apply<SelectionState>(
            {
                selected: {},
                selecting: false,
                selectingRange: Box.model(0, 0, 0, 0),
            },
            initialData
        );
    }
}
