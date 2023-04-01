import { useEditorController } from '../../EditorControllerContext';
import { useSlice } from '../../../hooks/useStore';
import { LineSelectionView } from './LineSelectionView';
import { LineEntity } from '@drawing/common';
import { RectSelectionView } from './RectSelectionView';

export const SelectionView = () => {
    const controller = useEditorController();
    const { camera, textEditing, firstSelectedEntity, selectedEntityIds } = useSlice(controller.store, (state) => {
        const firstSelectedEntityId = state.selectMode.entityIds[0];
        const firstSelectedEntity =
            firstSelectedEntityId === undefined ? undefined : state.page.entities[firstSelectedEntityId];

        return {
            camera: state.camera,
            textEditing: state.mode === 'textEditing',
            selectedEntityIds: state.selectMode.entityIds,
            firstSelectedEntity,
        };
    });
    if (textEditing) return null;

    if (selectedEntityIds.length === 0) return null;

    if (selectedEntityIds.length === 1 && firstSelectedEntity?.type === 'line') {
        return <LineSelectionView entity={firstSelectedEntity as LineEntity} camera={camera} />;
    }

    return <RectSelectionView />;
};
