import { Box, ModelCordBox } from './Box';
import { Patch } from './Patch';

export interface SelectModeState {
    entityIds: string[];
    selecting: boolean;
    range: ModelCordBox;
}

export module SelectModeState {
    export function create(initialData: Patch<SelectModeState> = {}) {
        return Patch.apply<SelectModeState>(
            {
                entityIds: [],
                selecting: false,
                range: Box.model(0, 0, 0, 0),
            },
            initialData
        );
    }
}
