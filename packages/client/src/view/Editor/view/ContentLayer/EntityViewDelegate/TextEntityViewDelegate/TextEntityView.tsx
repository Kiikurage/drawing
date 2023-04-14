import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { EditableEntityText } from '../../EditableEntityText';
import { TextEntity } from '@drawing/common/src/model/page/entity/TextEntity';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
    return <SVGContainer viewport={Entity.getBoundingBox(entity)} html={<EditableEntityText entity={entity} />} />;
};
