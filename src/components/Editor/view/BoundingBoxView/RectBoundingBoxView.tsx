import { css } from '@emotion/react';
import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { COLOR_SELECTION } from '../../../styles';
import { Camera } from '../../model/Camera';

export const RectBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: Entity }) => {
    const { point, size } = Box.toDisplay(camera, Entity.getBoundingBox(entity));

    return (
        <div
            css={css`
                position: absolute;
                left: ${point.x - 100}px;
                top: ${point.y - 100}px;
            `}
        >
            <svg width={size.width + 200} height={size.height + 200}>
                <rect
                    x={100}
                    y={100}
                    width={size.width}
                    height={size.height}
                    fill="transparent"
                    stroke={COLOR_SELECTION}
                    strokeWidth={1.5}
                />
            </svg>
        </div>
    );
};
