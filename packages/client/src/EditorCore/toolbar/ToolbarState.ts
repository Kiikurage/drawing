import { ToolbarItem } from './ToolbarItem';
import { Patch } from '@drawing/common/src/model/Patch';

export interface ToolbarState {
    items: ToolbarItem[];
}

export module ToolbarState {
    export function create(initialData: Patch<ToolbarState> = {}) {
        return Patch.apply({ items: [] }, initialData);
    }
}
