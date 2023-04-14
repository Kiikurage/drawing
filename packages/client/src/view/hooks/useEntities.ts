import { useSlice } from './useSlice';
import { useEditorViewController } from '../Editor/view/EditorControllerContext';

export function useEntities() {
    return useSlice(useEditorViewController().pageController.store, (state) => state.page.entities);
}
