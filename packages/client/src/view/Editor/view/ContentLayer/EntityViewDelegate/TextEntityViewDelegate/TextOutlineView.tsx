import { Entity, TextEntity } from '@drawing/common';
import { useEditorViewController } from '../../../EditorControllerContext';
import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { css } from '@linaria/core';
import { COLOR_SELECTION } from '../../../../../styles';
import { useCamera } from '../../../../../hooks/useCamera';
import { useIsSelected } from '../../../../../hooks/useIsSelected';

export const TextOutlineView = ({ entity }: { entity: TextEntity }) => {
    const controller = useEditorViewController();
    const selected = useIsSelected(entity.id);
    const camera = useCamera();
    const path = `M0 0h${entity.size.width}v${entity.size.height}h-${entity.size.width}v-${entity.size.height}`;

    return (
        <SVGContainer viewport={Entity.getBoundingBox(entity)}>
            <path
                visibility={selected ? 'visible' : 'hidden'}
                className={css`
                    &:hover {
                        visibility: visible;
                    }
                `}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2 / camera.scale}
                stroke={COLOR_SELECTION}
                fill="transparent"
                d={path}
                pointerEvents="all"
                onPointerDown={(ev) => {
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'entity',
                        entityId: entity.id,
                    });
                    ev.stopPropagation();
                }}
            />
        </SVGContainer>
    );
};
