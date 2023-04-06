import { Camera } from './Camera';
import { ContextMenuState } from './ContextMenuState';
import { EditorMode } from './EditorMode';
import { HoverState } from './HoverState';
import { SelectModeState } from './SelectModeState';
import { TextEditModeState } from './TextEditModeState';
import { Page } from './Page';
import { Patch } from './Patch';
import { SnapState } from './SnapState';

export interface EditorState {
    page: Page;
    mode: EditorMode;
    camera: Camera;
    hover: HoverState;
    contextMenu: ContextMenuState;
    textEditMode: TextEditModeState;
    selectMode: SelectModeState;
    snap: SnapState;
}

export module EditorState {
    export function create(initialData: Patch<EditorState> = {}) {
        return Patch.apply<EditorState>(
            {
                page: Page.create(),
                mode: 'select',
                camera: Camera.create(),
                hover: HoverState.IDLE,
                contextMenu: ContextMenuState.create(),
                textEditMode: TextEditModeState.create(),
                selectMode: SelectModeState.create(),
                snap: SnapState.create(),
            },
            initialData
        );
    }
}
