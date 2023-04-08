import { Camera, HoverState, Page, Patch } from '@drawing/common';

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
