import { useEditorController, useExtension } from '../../core/view/EditorControllerContext';
import { useSlice } from '../../../hooks/useStore';
import { Box } from '@drawing/common';
import { css } from '@linaria/core';
import { RangeSelectExtension } from './RangeSelectExtension';

export const SelectingRangeView = () => {
    const controller = useEditorController();
    const extension = useExtension(RangeSelectExtension);
    const { camera } = useSlice(controller.store, (state) => ({
        camera: state.camera,
    }));
    const { selecting, selectRange } = useSlice(extension.store, (state) => ({
        selecting: state.selecting,
        selectRange: state.range,
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
