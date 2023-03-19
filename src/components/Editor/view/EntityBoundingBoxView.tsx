import { css } from '@emotion/react';
import { Entity } from '../../../model/entity/Entity';
import { ModelCordPoint, Point } from '../../../model/Point';
import { COLOR_SELECTION } from '../../styles';
import { Camera } from '../model/Camera';

export const EntityBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: Entity }) => {
    const boundingBox = Entity.getBoundingBox(entity);
    const p1 = Point.toDisplay(camera, ModelCordPoint(boundingBox));

    return (
        <div
            css={css`
                position: absolute;
                left: ${p1.x - 100}px;
                top: ${p1.y - 100}px;
            `}
        >
            <svg width={boundingBox.width * camera.scale + 200} height={boundingBox.height * camera.scale + 200}>
                <rect
                    x={100}
                    y={100}
                    width={boundingBox.width * camera.scale}
                    height={boundingBox.height * camera.scale}
                    fill="transparent"
                    stroke={COLOR_SELECTION}
                    strokeWidth={1.5}
                />
            </svg>
        </div>
    );
};
