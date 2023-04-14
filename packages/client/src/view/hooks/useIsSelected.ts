import { useSlice } from './useSlice';
import { useEditorViewController } from '../Editor/view/EditorControllerContext';

export function useIsSelected(entityId: string) {
    const selected = useSlice(useEditorViewController().selectionController.store, (state) => {
        return state.selected;
    });

    return selected[entityId] ?? false;
}
