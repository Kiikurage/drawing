import { useEditorViewController } from '../EditorControllerContext';
import { useSlice } from '../../../hooks/useSlice';
import { SimpleSelectionView } from './SimpleSelectionView';
import { EntityViewDelegate } from '../ContentLayer/EntityViewDelegate/EntityViewDelegate';
import { createElement } from 'react';
import { useSelectedEntities } from '../../../hooks/useSelection';

export const SelectionView = () => {
    const controller = useEditorViewController();
    const selectedEntities = useSelectedEntities();

    const { editingEntityId } = useSlice(controller.textEditController.store, (state) => {
        return { editingEntityId: state.entityId };
    });

    if (editingEntityId !== '') return null;

    if (selectedEntities.length === 0) return null;

    if (selectedEntities.length === 1) {
        const entity = selectedEntities[0];
        const singleSelectionComponent = EntityViewDelegate.getDelegate(entity).singleSelectionComponentType;
        if (singleSelectionComponent !== undefined) {
            return createElement(singleSelectionComponent, { entity });
        }
    }

    return <SimpleSelectionView />;
};
