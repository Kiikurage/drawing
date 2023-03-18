import { Camera } from '../../model/Camera';
import { Entity } from '../../model/Entity';
import { Page } from '../../model/Page';
import { Patch } from '../../model/Patch';

export interface EditorState {
    page: Page;
    mode: 'select' | 'rect';
    camera: Camera;

    hoveredEntity: Entity | null;
    selectedEntities: Entity[];
}

export module EditorState {
    export function create(initialData: Patch<EditorState>) {
        return Patch.apply(
            {
                page: { entities: [] },
                mode: 'select',
                camera: Camera.create(),
                hoveredEntity: null,
                selectedEntities: [],
            },
            initialData
        );
    }
}
