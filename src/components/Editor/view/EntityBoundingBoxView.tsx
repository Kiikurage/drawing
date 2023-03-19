import { css } from '@emotion/react';
import { Entity } from '../../../model/Entity';
import { Camera } from '../model/Camera';

export const EntityBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: Entity }) => {
    if (entity.type !== 'rect') return null;

    const x = (entity.x - camera.x) * camera.scale;
    const y = (entity.y - camera.y) * camera.scale;
    return (
        <div
            css={css`
                position: absolute;
                left: ${x - 100}px;
                top: ${y - 100}px;
            `}
        >
            <svg width={entity.width * camera.scale + 200} height={entity.height * camera.scale + 200}>
                <rect
                    x={100}
                    y={100}
                    width={entity.width * camera.scale}
                    height={entity.height * camera.scale}
                    fill="transparent"
                    stroke="#4285f4"
                    strokeWidth={1.5}
                />
            </svg>
        </div>
    );
};
