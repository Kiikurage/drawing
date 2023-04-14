import { useSlice } from './useSlice';
import { useEditorViewController } from '../Editor/view/EditorControllerContext';
import { useMemo } from 'react';
import { useEntities } from './useEntities';

export function useSelectedEntities() {
    const selected = useSlice(useEditorViewController().selectionController.store, (state) => {
        return state.selected;
    });
    const entities = useEntities();

    return useMemo(() => Object.values(entities).filter((entity) => selected[entity.id]), [entities, selected]);
}

export function useSelectedEntityIds() {
    const selectedEntities = useSelectedEntities();

    return useMemo(() => selectedEntities.map((entity) => entity.id), [selectedEntities]);
}
