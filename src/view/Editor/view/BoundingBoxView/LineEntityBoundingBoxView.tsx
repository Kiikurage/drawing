import { LineEntity } from '../../../../model/entity/LineEntity';
import { Point } from '../../../../model/Point';
import { COLOR_SELECTION } from '../../../styles';
import { Camera } from '../../model/Camera';

export const LineEntityBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: LineEntity }) => {
    const p1 = Point.toDisplay(camera, entity.p1);
    const p2 = Point.toDisplay(camera, entity.p2);

    return (
        <path d={`M${p1.x},${p1.y} L${p2.x},${p2.y}`} pointerEvents="all" stroke={COLOR_SELECTION} strokeWidth={1.5} />
    );
};
