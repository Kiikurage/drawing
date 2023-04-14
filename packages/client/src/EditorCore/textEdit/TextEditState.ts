import { DisplayCordPoint, Point } from '@drawing/common/src/model/Point';
import { Patch } from '@drawing/common/src/model/Patch';

export interface TextEditState {
    entityId: string;
    editStartPoint: DisplayCordPoint;
}

export module TextEditState {
    export function create(initialData: Patch<TextEditState> = {}) {
        return Patch.apply<TextEditState>({ entityId: '', editStartPoint: Point.display(0, 0) }, initialData);
    }
}
