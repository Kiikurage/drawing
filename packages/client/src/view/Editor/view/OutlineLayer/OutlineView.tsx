import { createElement, memo } from 'react';
import { EntityViewDelegate } from '../ContentLayer/EntityViewDelegate/EntityViewDelegate';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';

export const OutlineView = memo(({ entity }: { entity: Entity }) => {
    return createElement(EntityViewDelegate.getDelegate(entity).outlineComponentType, { entity });
});
