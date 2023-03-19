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
                left: ${entity.point.x - 100}px;
                top: ${entity.point.y - 100}px;
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

    const { id, point, width, height, strokeColor } = entity;

    const left = Math.min(point.x, point.x + width);
    const top = Math.min(point.y, point.y + height);

    return (
        <svg
            css={css`
                position: absolute;
                left: ${left - 100}px;
                top: ${top - 100}px;
            `}
            width={Math.abs(width) + 200}
            height={Math.abs(height) + 200}
        >
            <path
                d={`M${point.x - left + 100},${point.y - top + 100} L${point.x + width - left + 100},${
                    point.y + height - top + 100
                }`}
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
