import { css } from '@emotion/react';
import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { Point } from '../../../../model/Point';
import { COLOR_SELECTION } from '../../../styles';
import { Camera } from '../../model/Camera';

export const LineEntityBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: LineEntity }) => {
    const boundingBox = Box.toDisplay(camera, Entity.getBoundingBox(entity));
    const p1 = Point.toDisplay(camera, entity.p1);
    const p2 = Point.toDisplay(camera, entity.p2);

    return (
        <div
            css={css`
                position: absolute;
                left: ${boundingBox.point.x - 100}px;
                top: ${boundingBox.point.y - 100}px;
            `}
        >
            <svg width={boundingBox.size.width + 200} height={boundingBox.size.height + 200}>
                <path
                    d={`M${p1.x - boundingBox.point.x + 100},${p1.y - boundingBox.point.y + 100} L${
                        p2.x - boundingBox.point.x + 100
                    },${p2.y - boundingBox.point.y + 100}`}
                    pointerEvents="all"
                    stroke={COLOR_SELECTION}
                    strokeWidth={1.5}
                />
            </svg>
        </div>
    );
};
