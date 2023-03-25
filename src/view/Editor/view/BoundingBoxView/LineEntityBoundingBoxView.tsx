import { css } from '@emotion/react';
import { ModelCordPoint, Point } from '../../../../model/Point';
import { COLOR_SELECTION } from '../../../styles';
import { Camera } from '../../model/Camera';

export const LineEntityBoundingBoxView = ({
    camera,
    p1,
    p2,
}: {
    camera: Camera;
    p1: ModelCordPoint;
    p2: ModelCordPoint;
}) => {
    const p1d = Point.toDisplay(camera, p1);
    const p2d = Point.toDisplay(camera, p2);

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
            <path
                d={`M${p1d.x},${p1d.y} L${p2d.x},${p2d.y}`}
                pointerEvents="all"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
            />
        </svg>
    );
};
