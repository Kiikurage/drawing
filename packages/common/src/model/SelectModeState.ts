import { Box, ModelCordBox } from './Box';
import { Patch } from './Patch';

export interface SelectModeState {
    entityIds: string[];
    selecting: boolean;
    transforming: boolean;
    range: ModelCordBox;
    snapEnabled: boolean;
}

export module SelectModeState {
    export function create(initialData: Patch<SelectModeState> = {}) {
        return Patch.apply<SelectModeState>(
            {
                entityIds: [],
                selecting: false,
                transforming: false,
                range: Box.model(0, 0, 0, 0),
                snapEnabled: false,
            },
            initialData
        );
    }
}
