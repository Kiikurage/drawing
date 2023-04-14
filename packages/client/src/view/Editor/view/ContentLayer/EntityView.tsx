import { createElement, memo } from 'react';
import { Entity } from '@drawing/common';
import { EntityViewDelegate } from './EntityViewDelegate/EntityViewDelegate';

export const EntityView = memo(({ entity }: { entity: Entity }) => {
    return createElement(EntityViewDelegate.getDelegate(entity).contentComponentType, { entity });
});
