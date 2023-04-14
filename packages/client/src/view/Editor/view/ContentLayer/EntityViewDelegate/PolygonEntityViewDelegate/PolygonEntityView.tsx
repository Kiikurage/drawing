import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { EditableEntityText } from '../../EditableEntityText';
import { createPath } from './util';
import { PolygonEntity } from '@drawing/common/src/model/page/entity/PolygonEntity';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { ColorPalette } from '@drawing/common/src/model/ColorPalette';

export const PolygonEntityView = ({ entity }: { entity: PolygonEntity }) => {
    const path = createPath(entity);

    return (
        <SVGContainer viewport={Entity.getBoundingBox(entity)} html={<EditableEntityText entity={entity} />}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={8}
                stroke={ColorPalette[entity.palette].strokeColor}
                fill={ColorPalette[entity.palette].fillColor}
                d={path}
            />
        </SVGContainer>
    );
};
