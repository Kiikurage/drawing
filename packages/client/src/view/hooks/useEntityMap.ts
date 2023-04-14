import { useSlice } from './useSlice';
import { useEditorViewController } from '../Editor/view/EditorControllerContext';
import { nonNull } from '@drawing/common/src/lib/nonNull';

export function useEntityMap() {
    return useSlice(useEditorViewController().pageController.store, (state) => state.page.entities);
}

export function useEntities() {
    return Object.values(useEntityMap()).filter(nonNull);
}
