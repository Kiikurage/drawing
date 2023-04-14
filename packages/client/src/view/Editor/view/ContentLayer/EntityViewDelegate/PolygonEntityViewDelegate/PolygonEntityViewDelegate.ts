import { EntityViewDelegate } from '../EntityViewDelegate';
import { PolygonEntityView } from './PolygonEntityView';
import { PolygonOutlineView } from './PolygonOutlineView';
import { PolygonEntity } from '@drawing/common/src/model/page/entity/PolygonEntity';

export const PolygonEntityViewDelegate: EntityViewDelegate<PolygonEntity> = {
    contentComponentType: PolygonEntityView,
    outlineComponentType: PolygonOutlineView,
};
