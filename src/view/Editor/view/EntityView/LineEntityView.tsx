import { css } from '@emotion/react';
import { Entity } from '../../../../model/entity/Entity';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { useEditorController } from '../../EditorControllerContext';
import { ColorPalette } from '../../model/ColorPalette';

export const LineEntityView = ({ entity }: { entity: LineEntity }) => {
    const controller = useEditorController();

    const { id, p1, p2, palette } = entity;

    const {
        point: { x, y },
        size: { width, height },
    } = Entity.getBoundingBox(entity);

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
                stroke={ColorPalette[palette].strokeColor}
                strokeWidth={4}
                onMouseOver={() => controller.onHover({ type: 'entity', entityId: id })}
                onMouseLeave={() => controller.onUnhover()}
            />
        </svg>
    );
};
