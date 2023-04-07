import { Patch } from '@drawing/common';
import { ToolbarItem } from './ToolbarItem';

export interface ToolbarState {
    items: ToolbarItem[];
}

export module ToolbarState {
    export function create(initialData: Patch<ToolbarState> = {}) {
        return Patch.apply({ items: [] }, initialData);
    }
}
