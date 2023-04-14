import { EntityViewDelegate } from '../EntityViewDelegate';
import { LineEntityView } from './LineEntityView';
import { LineOutlineView } from './LineOutlineView';
import { LineSelectionView } from './LineSelectionView';
import { LineEntity } from '@drawing/common/src/model/page/entity/LineEntity';

export const LineEntityViewDelegate: EntityViewDelegate<LineEntity> = {
    contentComponentType: LineEntityView,
    outlineComponentType: LineOutlineView,
    singleSelectionComponentType: LineSelectionView,
};
