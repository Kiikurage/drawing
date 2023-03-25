import { Box } from '../../../model/Box';
import { Camera } from '../model/Camera';
import { SelectModeState } from '../model/SelectModeState';

export const SelectingRangeView = ({ camera, selectMode }: { camera: Camera; selectMode: SelectModeState }) => {
    if (!selectMode.selecting) return null;

    const {
        point: { x, y },
        size: { width, height },
    } = Box.toDisplay(camera, selectMode.range);

    return <rect cursor="move" pointerEvents="all" x={x} y={y} width={width} height={height} fill="rgba(0,0,0,0.1)" />;
};
