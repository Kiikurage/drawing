import { DisplayCordPoint, Point } from '@drawing/common/src/model/Point';
import { Patch } from '@drawing/common/src/model/Patch';

export interface ContextMenuState {
    open: boolean;
    point: DisplayCordPoint;
}

export module ContextMenuState {
    export function create(initialData: Patch<ContextMenuState> = {}) {
        return Patch.apply({ open: false, point: Point.display(0, 0) }, initialData);
    }
}
