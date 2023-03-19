import { css } from '@emotion/react';
import { Entity } from '../../../model/Entity';
import { RectEntity } from '../../../model/RectEntity';
import { TextEntity } from '../../../model/TextEntity';
import { useEditorController } from '../EditorControllerContext';

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
        <svg
            css={css`
                position: absolute;
                left: ${entity.x - 100}px;
                top: ${entity.y - 100}px;
            `}
            width={entity.width + 200}
            height={entity.height + 200}
        >
            <rect
                x={100}
                y={100}
                width={entity.width}
                height={entity.height}
                stroke={entity.strokeColor}
                strokeWidth={4}
                fill={entity.fillColor}
                onMouseDown={(ev) => {
                    ev.stopPropagation();
                    controller.onEntityMouseDown(entity, ev.shiftKey);
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
        </svg>
    );
};

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
    const controller = useEditorController();

    return (
        <div
            css={css`
                position: absolute;
                left: ${entity.x}px;
                top: ${entity.y}px;
                user-select: none;
            `}
            onMouseDown={(ev) => {
                ev.stopPropagation();
                controller.onEntityMouseDown(entity, ev.shiftKey);
            }}
        >
            <span>{entity.value}</span>
        </div>
    );
};
