import { Camera } from '@drawing/common/src/model/Camera';
import { HoverState } from '@drawing/common/src/model/HoverState';
import { Page } from '@drawing/common/src/model/Page';
import { Patch } from '@drawing/common/src/model/Patch';

export interface EditorState {
    page: Page;
    camera: Camera;
    hover: HoverState;
}

export module EditorState {
    export function create(initialData: Patch<EditorState> = {}) {
        return Patch.apply<EditorState>(
            {
                page: Page.create(),
                camera: Camera.create(),
                hover: HoverState.IDLE,
            },
            initialData
        );
    }
}
