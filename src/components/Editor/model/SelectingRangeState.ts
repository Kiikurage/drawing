import { Box, ModelCordBox } from '../../../model/Box';

export interface SelectingRangeState {
    selecting: boolean;
    range: ModelCordBox;
}

export module SelectingRangeState {
    export function create(): SelectingRangeState {
        return {
            selecting: false,
            range: Box.model(0, 0, 0, 0),
        };
    }
}
