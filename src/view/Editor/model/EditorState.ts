import { Page } from '../../../model/Page';
import { Patch } from '../../../model/Patch';
import { Camera } from './Camera';
import { ContextMenuState } from './ContextMenuState';
import { EditorMode } from './EditorMode';
import { HoverState } from './HoverState';
import { SelectModeState } from './SelectModeState';
import { TextEditModeState } from './TextEditModeState';

export interface EditorState {
    page: Page;
    mode: EditorMode;
    camera: Camera;
    hover: HoverState;
    contextMenu: ContextMenuState;
    textEditMode: TextEditModeState;
    selectMode: SelectModeState;
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
            },
            initialData
        );
    }
}
