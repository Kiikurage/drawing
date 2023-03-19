import { Entity } from '../../../../model/entity/Entity';
import { Camera } from '../../model/Camera';
import { LineEntityBoundingBoxView } from './LineEntityBoundingBoxView';
import { RectBoundingBoxView } from './RectBoundingBoxView';

export const EntityBoundingBoxView = ({ camera, entity }: { camera: Camera; entity: Entity }) => {
    if (entity.type === 'line') {
        return <LineEntityBoundingBoxView entity={entity} camera={camera} />;
    }

    return <RectBoundingBoxView entity={entity} camera={camera} />;
};
