import { useSlice } from './useSlice';
import { useEditorViewController } from '../Editor/view/EditorControllerContext';

export function useCamera() {
    return useSlice(useEditorViewController().cameraController.store, (state) => state);
}
