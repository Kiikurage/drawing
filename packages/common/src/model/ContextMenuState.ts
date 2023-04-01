import { ModelCordPoint, Point } from './Point';
import { Patch } from './Patch';

export interface ContextMenuState {
    open: boolean;
    point: ModelCordPoint;
}

export module ContextMenuState {
    export function create(initialData: Patch<ContextMenuState> = {}) {
        return Patch.apply({ open: false, point: Point.model(0, 0) }, initialData);
    }
}
