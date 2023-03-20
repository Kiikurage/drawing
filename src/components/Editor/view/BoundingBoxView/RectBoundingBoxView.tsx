import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { COLOR_SELECTION } from '../../../styles';
import { Camera } from '../../model/Camera';

export const RectBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: Entity }) => {
    const { point, size } = Box.toDisplay(camera, Entity.getBoundingBox(entity));

    return (
        <rect
            x={point.x}
            y={point.y}
            width={size.width}
            height={size.height}
            fill="none"
            stroke={COLOR_SELECTION}
            strokeWidth={1.5}
        />
    );
};
