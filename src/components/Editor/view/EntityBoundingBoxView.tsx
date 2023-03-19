import { css } from '@emotion/react';
import { Entity } from '../../../model/entity/Entity';
import { Point } from '../../../model/Point';
import { COLOR_SELECTION } from '../../styles';
import { Camera } from '../model/Camera';

export const EntityBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: Entity }) => {
    const point = Point.toDisplay(camera, entity.point);
    return (
        <div
            css={css`
                position: absolute;
                left: ${point.x - 100}px;
                top: ${point.y - 100}px;
            `}
        >
            <svg width={entity.width * camera.scale + 200} height={entity.height * camera.scale + 200}>
                <rect
                    x={100}
                    y={100}
                    width={entity.width * camera.scale}
                    height={entity.height * camera.scale}
                    fill="transparent"
                    stroke={COLOR_SELECTION}
                    strokeWidth={1.5}
                />
            </svg>
        </div>
    );
};
