import { css } from '@emotion/react';
import { Entity } from '../../../model/entity/Entity';
import { RectEntity } from '../../../model/entity/RectEntity';
import { TextEntity } from '../../../model/entity/TextEntity';
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
                left: ${entity.point.x - 100}px;
                top: ${entity.point.y - 100}px;
            `}
            width={entity.width + 200}
            height={entity.height + 200}
        >
            <rect
                css={css`
                    pointer-events: all;
                `}
                x={100}
                y={100}
                width={entity.width}
                height={entity.height}
                stroke={entity.strokeColor}
                strokeWidth={4}
                fill={entity.fillColor}
                onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
                onMouseLeave={() => controller.onUnhover()}
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
                left: ${entity.point.x}px;
                top: ${entity.point.y}px;
                user-select: none;
            `}
            onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
            onMouseLeave={() => controller.onUnhover()}
        >
            <span>{entity.value}</span>
        </div>
    );
};
