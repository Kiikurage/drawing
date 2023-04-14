import { createElement, memo } from 'react';
import { Entity } from '@drawing/common';
import { EntityViewDelegate } from '../ContentLayer/EntityViewDelegate/EntityViewDelegate';

export const OutlineView = memo(({ entity }: { entity: Entity }) => {
    return createElement(EntityViewDelegate.getDelegate(entity).outlineComponentType, { entity });
});
