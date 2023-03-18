import { css } from '@emotion/react';
import { Entity } from '../model/Entity';
import { RectEntity } from '../model/RectEntity';
import { TextEntity } from '../model/TextEntity';
import { useEditorController } from './Editor/EditorControllerContext';

export const EntityView = ({ entity }: { entity: Entity }) => {
    if (entity.type === 'rect') {
        return <RectEntityView entity={entity} />;
    } else if (entity.type === 'text') {
        return <TextEntityView entity={entity} />;
    } else {
        throw new Error('Impossible!');
    }
};

export const RectEntityView = ({ entity }: { entity: RectEntity }) => {
    const controller = useEditorController();

    return (
        <rect
            x={entity.x}
            y={entity.y}
            width={entity.width}
            height={entity.height}
            stroke={entity.strokeColor}
            strokeWidth={4}
            fill={entity.fillColor}
            onMouseDown={(ev) => {
                ev.stopPropagation();
                controller.onEntityMouseDown(entity);
            }}
            onMouseOver={(ev) => {
                ev.stopPropagation();
                controller.onEntityMouseOver(entity);
            }}
            onMouseLeave={(ev) => {
                ev.stopPropagation();
                controller.onEntityMouseLeave(entity);
            }}
        />
    );
};

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
    const controller = useEditorController();

    return (
        <text
            css={css`
                user-select: none;
            `}
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
};
