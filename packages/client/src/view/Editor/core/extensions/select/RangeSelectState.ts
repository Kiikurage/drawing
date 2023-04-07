import { Box, ModelCordBox, Patch } from '@drawing/common';

export interface RangeSelectState {
    selecting: boolean;
    range: ModelCordBox;
}

export module RangeSelectState {
    export function create(initialData: Patch<RangeSelectState> = {}) {
        return Patch.apply<RangeSelectState>(
            {
                selecting: false,
                range: Box.model(0, 0, 0, 0),
            },
            initialData
        );
    }
}
