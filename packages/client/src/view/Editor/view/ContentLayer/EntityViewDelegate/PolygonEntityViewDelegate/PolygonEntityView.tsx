import { ColorPalette, Entity, PolygonEntity } from '@drawing/common';
import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { EditableEntityText } from '../../EditableEntityText';
import { createPath } from './util';

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
