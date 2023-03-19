import { Page } from '../../../model/Page';
import { Patch } from '../../../model/Patch';
import { Camera } from './Camera';
import { HoverState } from './HoverState';

export interface EditorState {
    page: Page;
    mode: 'select' | 'rect';
    camera: Camera;

    hover: HoverState | null;
    selectedEntityIds: string[];
}

export module EditorState {
    export function create(initialData: Patch<EditorState>) {
        return Patch.apply(
            {
                page: { entities: [] },
                mode: 'select',
                camera: Camera.create(),
                hover: null,
                selectedEntityIds: [],
            },
            initialData
        );
    }
}
