import { TextEntity } from '@drawing/common';
import { EntityViewDelegate } from '../EntityViewDelegate';
import { TextEntityView } from './TextEntityView';
import { TextOutlineView } from './TextOutlineView';

export const TextEntityViewDelegate: EntityViewDelegate<TextEntity> = {
    contentComponentType: TextEntityView,
    outlineComponentType: TextOutlineView,
};
