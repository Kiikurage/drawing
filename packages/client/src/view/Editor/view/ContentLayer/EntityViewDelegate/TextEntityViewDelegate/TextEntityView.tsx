import { Entity, TextEntity } from '@drawing/common';
import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { EditableEntityText } from '../../EditableEntityText';

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
    return <SVGContainer viewport={Entity.getBoundingBox(entity)} html={<EditableEntityText entity={entity} />} />;
};
