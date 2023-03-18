import { Entity } from '../model/Entity';
import { useEditorController } from './Editor/EditorControllerContext';

export const EntityView = ({ entity }: { entity: Entity }) => {
    const controller = useEditorController();

    if (entity.type === 'rect') {
        return (
            <rect
                x={entity.x}
                y={entity.y}
                width={entity.width}
                height={entity.height}
                stroke={entity.strokeColor}
                fill={entity.fillColor}
                onMouseDown={(ev) => {
                    ev.stopPropagation();
                    controller.onEntityMouseDown(entity);
                }}
            />
        );
    } else if (entity.type === 'text') {
        return (
            <text
                x={entity.x}
                y={entity.y}
                onMouseDown={(ev) => {
                    ev.stopPropagation();
                    controller.onEntityMouseDown(entity);
                }}
            >
                {entity.value}
            </text>
        );
    } else {
        throw new Error('Impossible!');
    }
};
