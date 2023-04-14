import { useEditorViewController } from '../../../EditorControllerContext';
import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { css } from '@linaria/core';
import { COLOR_SELECTION } from '../../../../../styles';
import { createPath } from './util';
import { useCamera } from '../../../../../hooks/useCamera';
import { useIsSelected } from '../../../../../hooks/useIsSelected';
import { PolygonEntity } from '@drawing/common/src/model/page/entity/PolygonEntity';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';

export const PolygonOutlineView = ({ entity }: { entity: PolygonEntity }) => {
    const controller = useEditorViewController();
    const selected = useIsSelected(entity.id);
    const camera = useCamera();

    const path = createPath(entity);

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
