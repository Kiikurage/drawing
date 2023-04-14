import { Box, ModelCordBox } from '@drawing/common/src/model/Box';
import { Patch } from '@drawing/common/src/model/Patch';

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
