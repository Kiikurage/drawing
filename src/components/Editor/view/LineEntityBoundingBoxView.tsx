import { css } from '@emotion/react';
import { Entity } from '../../../model/entity/Entity';
import { LineEntity } from '../../../model/entity/LineEntity';
import { ModelCordPoint, Point } from '../../../model/Point';
import { COLOR_SELECTION } from '../../styles';
import { Camera } from '../model/Camera';

export const LineEntityBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: LineEntity }) => {
    const boundingBox = Entity.getBoundingBox(entity);
    const p = Point.toDisplay(camera, ModelCordPoint(boundingBox));
    const p1 = Point.toDisplay(camera, entity.p1);
    const p2 = Point.toDisplay(camera, entity.p2);

    return (
        <div
            css={css`
                position: absolute;
                left: ${p.x - 100}px;
                top: ${p.y - 100}px;
            `}
        >
            <svg width={boundingBox.width * camera.scale + 200} height={boundingBox.height * camera.scale + 200}>
                <path
                    d={`M${p1.x - p.x + 100},${p1.y - p.y + 100} L${p2.x - p.x + 100},${p2.y - p.y + 100}`}
                    pointerEvents="all"
                    stroke={COLOR_SELECTION}
                    strokeWidth={1.5}
                />
            </svg>
        </div>
    );
};
