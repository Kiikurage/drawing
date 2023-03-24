import { css } from '@emotion/react';
import { RectEntity } from '../../../../model/entity/RectEntity';
import { useEditorController } from '../../EditorControllerContext';

export const RectEntityView = ({ entity }: { entity: RectEntity }) => {
    const controller = useEditorController();

    return (
        <svg
            css={css`
                position: absolute;
            `}
            style={{
                left: entity.p1.x - 10,
                top: entity.p1.y - 10,
            }}
            width={entity.size.width + 20}
            height={entity.size.height + 20}
        >
            <g transform="translate(10,10)">
                <rect
                    pointerEvents="all"
                    x={0}
                    y={0}
                    width={entity.size.width}
                    height={entity.size.height}
                    stroke={entity.strokeColor}
                    strokeWidth={4}
                    fill={entity.fillColor}
                    onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
                    onMouseLeave={() => controller.onUnhover()}
                />
            </g>
        </svg>
    );
};
