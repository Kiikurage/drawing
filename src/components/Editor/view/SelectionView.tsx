import { css } from '@emotion/react';
import { Entity } from '../../../model/Entity';
import { COLOR_SELECTION } from '../../styles';
import { Camera } from '../model/Camera';

export const SelectionView = ({ camera, selectedEntities }: { camera: Camera; selectedEntities: Entity[] }) => {
    let x0 = +Infinity,
        y0 = +Infinity,
        x1 = -Infinity,
        y1 = -Infinity;

    for (const entity of selectedEntities) {
        x0 = Math.min(entity.x, x0);
        y0 = Math.min(entity.y, y0);

        if (entity.type === 'rect') {
            x1 = Math.max(entity.x + entity.width, x1);
            y1 = Math.max(entity.y + entity.height, y1);
        }
    }
    const width = x1 - x0;
    const height = y1 - y0;

    return (
        <svg
            css={css`
                position: absolute;
                left: ${(x0 - camera.x) * camera.scale - 100}px;
                top: ${(y0 - camera.y) * camera.scale - 100}px;
            `}
            width={width * camera.scale + 200}
            height={height * camera.scale + 200}
        >
            <rect
                x="100"
                y="100"
                width={width * camera.scale}
                height={height * camera.scale}
                fill="transparent"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
            />
            <rect x="96" y="96" width="9" height="9" fill="#fff" stroke={COLOR_SELECTION} strokeWidth={1.5} />
            <rect
                x={96 + width * camera.scale}
                y="96"
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
            />
            <rect
                x="96"
                y={96 + height * camera.scale}
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
            />
            <rect
                x={96 + width * camera.scale}
                y={96 + height * camera.scale}
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
            />
        </svg>
    );
};
