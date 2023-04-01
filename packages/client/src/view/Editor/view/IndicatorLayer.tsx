import { css } from '@linaria/core';
import { memo } from 'react';
import { SelectingRangeView } from './SelectingRangeView';
import { SelectionView } from './SelectionView/SelectionView';
import { SnapGuide } from './SnapGuide';

export const IndicatorLayer = memo(() => {
    return (
        <div
            className={css`
                position: absolute;
                inset: 0;
            `}
        >
            <SelectionView />
            <SelectingRangeView />
            <SnapGuide />
        </div>
    );
});
