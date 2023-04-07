import { DisplayCordPoint, Patch, Point } from '@drawing/common';

export interface ContextMenuState {
    open: boolean;
    point: DisplayCordPoint;
}

export module ContextMenuState {
    export function create(initialData: Patch<ContextMenuState> = {}) {
        return Patch.apply({ open: false, point: Point.display(0, 0) }, initialData);
    }
}
