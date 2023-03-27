import { Patch } from '../../../model/Patch';
import { DisplayCordPoint, Point } from '../../../model/Point';

export interface TextEditModeState {
    entityId: string;
    editStartPoint: DisplayCordPoint;
}

export module TextEditModeState {
    export function create(initialData: Patch<TextEditModeState> = {}) {
        return Patch.apply<TextEditModeState>({ entityId: '', editStartPoint: Point.display(0, 0) }, initialData);
    }
}
