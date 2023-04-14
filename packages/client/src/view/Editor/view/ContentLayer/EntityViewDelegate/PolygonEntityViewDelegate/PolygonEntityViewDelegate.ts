import { PolygonEntity } from '@drawing/common';
import { EntityViewDelegate } from '../EntityViewDelegate';
import { PolygonEntityView } from './PolygonEntityView';
import { PolygonOutlineView } from './PolygonOutlineView';

export const PolygonEntityViewDelegate: EntityViewDelegate<PolygonEntity> = {
    contentComponentType: PolygonEntityView,
    outlineComponentType: PolygonOutlineView,
};
