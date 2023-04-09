import { useEditor, useExtension } from '../EditorControllerContext';
import { useSlice } from '../../../../hooks/useStore';
import { LineSelectionView } from './LineSelectionView';
import { LineEntity } from '@drawing/common';
import { RectSelectionView } from './RectSelectionView';
import { TextEditExtension } from '../../extensions/textEdit/TextEditExtension';
import { SelectExtension } from '../../extensions/select/SelectExtension';

export const SelectionView = () => {
    const editor = useEditor();
    const { camera } = useSlice(editor.store, (state) => {
        return { camera: state.camera };
    });

    const selectExtension = useExtension(SelectExtension);
    const { firstSelectedEntity, selectedEntityIds } = useSlice(selectExtension.store, (state) => {
        const firstSelectedEntityId = Object.values(state.entities)[0]?.id;
        const firstSelectedEntity =
            firstSelectedEntityId === undefined ? undefined : state.entities[firstSelectedEntityId];

        return {
            selectedEntityIds: Object.keys(state.entities),
            firstSelectedEntity,
        };
    });

    const textEditExtension = useExtension(TextEditExtension);
    const { textEditing } = useSlice(textEditExtension.store, (state) => {
        return { textEditing: state.entityId !== '' };
    });

    if (textEditing) return null;

    if (selectedEntityIds.length === 0) return null;

    if (selectedEntityIds.length === 1 && firstSelectedEntity?.type === 'line') {
        return <LineSelectionView entity={firstSelectedEntity as LineEntity} camera={camera} />;
    }

    return <RectSelectionView />;
};
