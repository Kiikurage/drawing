import { css } from '@emotion/react';
import { TextEntity } from '../../../../model/entity/TextEntity';
import { useEditorController } from '../../EditorControllerContext';

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
