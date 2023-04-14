import { Entity } from '@drawing/common';
import { css } from '@linaria/core';
import { useEditorViewController } from '../EditorControllerContext';
import { useSlice } from '../../../hooks/useSlice';
import { EditableText } from './EditableText';
import { useCamera } from '../../../hooks/useCamera';

export const EditableEntityText = ({ entity }: { entity: Entity }) => {
    const controller = useEditorViewController();
    const camera = useCamera();

    const { editingEntityId, editStartPoint } = useSlice(controller.textEditController.store, (state) => {
        return {
            editingEntityId: state.entityId,
            editStartPoint: state.editStartPoint,
        };
    });

    const editing = editingEntityId === entity.id;

    return (
        <div
            className={css`
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            `}
        >
            <EditableText
                value={entity.text}
                camera={camera}
                editing={editing}
                editStartPoint={editStartPoint}
                onChange={(ev) => controller.textEditController.updateEditingText(entity.id, ev.target.value)}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    controller.pageController.updateEntities({
                        [entity.id]: {
                            contentSize: {
                                width: contentWidth,
                                height: contentHeight,
                            },
                        },
                    });
                }}
            />
        </div>
    );
};
