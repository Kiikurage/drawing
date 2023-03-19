import { memo, SVGAttributes } from 'react';
import { COLOR_SELECTION } from '../../../styles';

export const ResizeHandle = memo(({ ...otherProps }: {} & SVGAttributes<SVGRectElement>) => {
    return (
        <rect
            pointerEvents="all"
            width="9"
            height="9"
            fill="#fff"
            stroke={COLOR_SELECTION}
            strokeWidth={1.5}
            {...otherProps}
        />
    );
});
