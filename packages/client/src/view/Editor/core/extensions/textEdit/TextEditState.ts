import { DisplayCordPoint, Patch, Point } from '@drawing/common';

export interface TextEditState {
    entityId: string;
    editStartPoint: DisplayCordPoint;
}

export module TextEditState {
    export function create(initialData: Patch<TextEditState> = {}) {
        return Patch.apply<TextEditState>({ entityId: '', editStartPoint: Point.display(0, 0) }, initialData);
    }
}
