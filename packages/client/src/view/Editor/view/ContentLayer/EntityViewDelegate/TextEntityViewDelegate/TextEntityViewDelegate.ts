import { EntityViewDelegate } from '../EntityViewDelegate';
import { TextEntityView } from './TextEntityView';
import { TextOutlineView } from './TextOutlineView';
import { TextEntity } from '@drawing/common/src/model/page/entity/TextEntity';

export const TextEntityViewDelegate: EntityViewDelegate<TextEntity> = {
    contentComponentType: TextEntityView,
    outlineComponentType: TextOutlineView,
};
