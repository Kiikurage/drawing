import { Box } from '../../../model/Box';
import { Camera } from '../model/Camera';
import { SelectingRangeState } from '../model/SelectingRangeState';

export const SelectingRangeView = ({
    camera,
    selectingRange,
}: {
    camera: Camera;
    selectingRange: SelectingRangeState;
}) => {
    if (!selectingRange.selecting) return null;

    const {
        point: { x, y },
        size: { width, height },
    } = Box.toDisplay(camera, selectingRange.range);

    return <rect cursor="move" pointerEvents="all" x={x} y={y} width={width} height={height} fill="rgba(0,0,0,0.1)" />;
};
