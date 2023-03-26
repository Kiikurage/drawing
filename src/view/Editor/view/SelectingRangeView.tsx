import { css } from '@linaria/core';
import { Box } from '../../../model/Box';
import { useSlice } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';

export const SelectingRangeView = () => {
    const controller = useEditorController();
    const { camera, selecting, selectRange } = useSlice(controller.store, (state) => ({
        camera: state.camera,
        selecting: state.selectMode.selecting,
        selectRange: state.selectMode.range,
    }));
    if (!selecting) return null;

    const {
        point: { x, y },
        size: { width, height },
    } = Box.toDisplay(camera, selectRange);

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
