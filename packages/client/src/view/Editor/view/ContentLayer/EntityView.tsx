import { createElement, memo } from 'react';
import { EntityViewDelegate } from './EntityViewDelegate/EntityViewDelegate';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';

export const EntityView = memo(({ entity }: { entity: Entity }) => {
    return createElement(EntityViewDelegate.getDelegate(entity).contentComponentType, { entity });
});
