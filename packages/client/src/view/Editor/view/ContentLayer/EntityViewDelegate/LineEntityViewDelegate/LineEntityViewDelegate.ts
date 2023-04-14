import { LineEntity } from '@drawing/common';
import { EntityViewDelegate } from '../EntityViewDelegate';
import { LineEntityView } from './LineEntityView';
import { LineOutlineView } from './LineOutlineView';
import { LineSelectionView } from './LineSelectionView';

export const LineEntityViewDelegate: EntityViewDelegate<LineEntity> = {
    contentComponentType: LineEntityView,
    outlineComponentType: LineOutlineView,
    singleSelectionComponentType: LineSelectionView,
};
