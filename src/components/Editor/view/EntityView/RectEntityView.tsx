import { css } from '@emotion/react';
import { RectEntity } from '../../../../model/entity/RectEntity';
import { useEditorController } from '../../EditorControllerContext';

export const RectEntityView = ({ entity }: { entity: RectEntity }) => {
    const controller = useEditorController();

    return (
        <svg
            css={css`
                position: absolute;
                left: ${entity.p1.x - 100}px;
                top: ${entity.p1.y - 100}px;
            `}
            width={entity.size.width + 200}
            height={entity.size.height + 200}
        >
            <rect
                pointerEvents="all"
                x={100}
                y={100}
                width={entity.size.width}
                height={entity.size.height}
                stroke={entity.strokeColor}
                strokeWidth={4}
                fill={entity.fillColor}
                onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
                onMouseLeave={() => controller.onUnhover()}
            />
        </svg>
    );
};
