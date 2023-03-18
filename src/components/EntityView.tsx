import { Entity } from '../model/Entity';

export const EntityView = ({ entity }: { entity: Entity }) => {
    if (entity.type === 'rect') {
        return (
            <rect
                x={entity.x}
                y={entity.y}
                width={entity.width}
                height={entity.height}
                stroke={entity.strokeColor}
                fill={entity.fillColor}
            />
        );
    } else if (entity.type === 'text') {
        return (
            <text x={entity.x} y={entity.y}>
                {entity.value}
            </text>
        );
    } else {
        throw new Error('Impossible!');
    }
};
