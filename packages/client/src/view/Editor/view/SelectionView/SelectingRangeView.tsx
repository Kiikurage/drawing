import { useEditorViewController } from '../EditorControllerContext';
import { useSlice } from '../../../hooks/useSlice';
import { css } from '@linaria/core';
import { useCamera } from '../../../hooks/useCamera';
import { Box } from '@drawing/common/src/model/Box';

export const SelectingRangeView = () => {
    const controller = useEditorViewController();
    const { selecting, selectingRange } = useSlice(controller.selectionController.store, (state) => ({
        selecting: state.selecting,
        selectingRange: state.selectingRange,
    }));
    const camera = useCamera();

    if (!selecting) return null;

    const {
        point: { x, y },
        size: { width, height },
    } = Box.toDisplay(camera, selectingRange);

    return (
        <svg
            className={css`
                position: absolute;
                top: 0;
                left: 0;
            `}
            width="100%"
            height="100%"
        >
            <rect cursor="move" pointerEvents="all" x={x} y={y} width={width} height={height} fill="rgba(0,0,0,0.1)" />
        </svg>
    );
};
