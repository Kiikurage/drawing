import { Page } from '../../../model/Page';
import { Patch } from '../../../model/Patch';
import { Camera } from './Camera';
import { ContextMenuState } from './ContextMenuState';
import { EditorMode } from './EditorMode';
import { HoverState } from './HoverState';
import { SelectingRangeState } from './SelectingRangeState';

export interface EditorState {
    page: Page;
    mode: EditorMode;
    camera: Camera;
    hover: HoverState | null;

    selectingRange: SelectingRangeState;
    selectedEntityIds: string[];
    contextMenu: ContextMenuState;
}

export module EditorState {
    export function create(initialData: Patch<EditorState> = {}) {
        return Patch.apply<EditorState>(
            {
                page: Page.create(),
                mode: 'select',
                camera: Camera.create(),
                hover: null,
                selectingRange: SelectingRangeState.create(),
                selectedEntityIds: [],
                contextMenu: ContextMenuState.create(),
            },
            initialData
        );
    }
}
