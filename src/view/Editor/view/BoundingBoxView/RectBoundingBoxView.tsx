import { css } from '@emotion/react';
import { Box, ModelCordBox } from '../../../../model/Box';
import { COLOR_SELECTION } from '../../../styles';
import { Camera } from '../../model/Camera';

export const RectBoundingBoxView = ({ camera, box }: { camera: Camera; box: ModelCordBox }) => {
    const { point, size } = Box.toDisplay(camera, box);

    return (
        <svg
            css={css`
                position: absolute;
                top: 0;
                left: 0;
            `}
            width="100%"
            height="100%"
        >
            <rect
                x={point.x}
                y={point.y}
                width={size.width}
                height={size.height}
                fill="none"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
            />
        </svg>
    );
};
