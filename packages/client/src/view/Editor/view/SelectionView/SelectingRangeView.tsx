import { useEditorViewController } from '../EditorControllerContext';
import { useSlice } from '../../../hooks/useSlice';
import { SVGContainer } from '@drawing/client/src/view/Editor/view/CameraLayer/SVGContainer';

export const SelectingRangeView = () => {
    const controller = useEditorViewController();
    const { selecting, selectingRange } = useSlice(controller.selectionController.store, (state) => ({
        selecting: state.selecting,
        selectingRange: state.selectingRange,
    }));

    if (!selecting) return null;

    return (
        <SVGContainer viewport={selectingRange}>
            <rect
                cursor="move"
                pointerEvents="all"
                width={selectingRange.size.width}
                height={selectingRange.size.height}
                fill="rgba(0,0,0,0.1)"
            />
        </SVGContainer>
    );
};
