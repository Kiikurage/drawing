import { css } from '@emotion/react';
import { Entity } from '../../../model/entity/Entity';
import { LineEntity } from '../../../model/entity/LineEntity';
import { RectEntity } from '../../../model/entity/RectEntity';
import { TextEntity } from '../../../model/entity/TextEntity';
import { useEditorController } from '../EditorControllerContext';

export const EntityView = ({ entity }: { entity: Entity }) => {
    if (entity.type === 'rect') {
        return <RectEntityView entity={entity} />;
    } else if (entity.type === 'text') {
        return <TextEntityView entity={entity} />;
    } else if (entity.type === 'line') {
        return <LineEntityView entity={entity} />;
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
                left: ${entity.p1.x - 100}px;
                top: ${entity.p1.y - 100}px;
            `}
            width={entity.width + 200}
            height={entity.height + 200}
        >
            <rect
                pointerEvents="all"
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

export const LineEntityView = ({ entity }: { entity: LineEntity }) => {
    const controller = useEditorController();

    const { id, p1, p2, strokeColor } = entity;

    const { x, y, width, height } = Entity.getBoundingBox(entity);

    return (
        <svg
            css={css`
                position: absolute;
                left: ${x - 100}px;
                top: ${y - 100}px;
            `}
            width={Math.abs(width) + 200}
            height={Math.abs(height) + 200}
        >
            <path
                d={`M${p1.x - x + 100},${p1.y - y + 100} L${p2.x - x + 100},${p2.y - y + 100}`}
                pointerEvents="all"
                stroke={strokeColor}
                strokeWidth={4}
                onMouseOver={() => controller.onHover({ type: 'entity', entityId: id })}
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
                left: ${entity.p1.x}px;
                top: ${entity.p1.y}px;
                user-select: none;
            `}
            onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
            onMouseLeave={() => controller.onUnhover()}
        >
            <span>{entity.value}</span>
        </div>
    );
};
