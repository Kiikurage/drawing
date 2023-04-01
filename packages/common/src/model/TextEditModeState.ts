import { DisplayCordPoint, Point } from './Point';
import { Patch } from './Patch';

export interface TextEditModeState {
    entityId: string;
    editStartPoint: DisplayCordPoint;
}

export module TextEditModeState {
    export function create(initialData: Patch<TextEditModeState> = {}) {
        return Patch.apply<TextEditModeState>({ entityId: '', editStartPoint: Point.display(0, 0) }, initialData);
    }
}
