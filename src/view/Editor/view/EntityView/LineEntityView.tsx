import { css } from '@linaria/core';
import { Entity } from '../../../../model/entity/Entity';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { useSlice } from '../../../hooks/useStore';
import { COLOR_SELECTION } from '../../../styles';
import { useEditorController } from '../../EditorControllerContext';
import { ColorPalette } from '../../model/ColorPalette';

export const LineEntityView = ({ entity }: { entity: LineEntity }) => {
    const controller = useEditorController();
    const { camera, highlighted } = useSlice(controller.store, (state) => ({
        camera: state.camera,
        highlighted:
            state.selectMode.entityIds.includes(entity.id) ||
            (state.hover.type === 'entity' && state.hover.entityId === entity.id),
    }));

    const { id, p1, p2, palette } = entity;

    const {
        point: { x, y },
        size: { width, height },
    } = Entity.getBoundingBox(entity);

    const pathDefinition = `M${p1.x - x},${p1.y - y} L${p2.x - x},${p2.y - y}`;

    return (
        <svg
            className={css`
                position: absolute;
            `}
            style={{
                left: x - 100,
                top: y - 100,
            }}
            width={Math.abs(width) + 200}
            height={Math.abs(height) + 200}
        >
            <g transform="translate(100,100)">
                <path
                    d={pathDefinition}
                    pointerEvents="all"
                    stroke={ColorPalette[palette].strokeColor}
                    strokeWidth={4}
                    onMouseOver={() => controller.onHover({ type: 'entity', entityId: id })}
                    onMouseLeave={controller.onUnhover}
                />
                {highlighted && <path d={pathDefinition} stroke={COLOR_SELECTION} strokeWidth={2 / camera.scale} />}
            </g>
        </svg>
    );
};
