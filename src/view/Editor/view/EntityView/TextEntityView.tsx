import { TextEntity } from '../../../../model/entity/TextEntity';
import { useSlice } from '../../../hooks/useStore';
import { useEditorController } from '../../EditorControllerContext';
import { ColorPalette } from '../../model/ColorPalette';
import { EditableTextView } from './EditableTextView';

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
    const controller = useEditorController();
    const { camera, textEditing, editStartPoint, highlighted } = useSlice(controller.store, (state) => {
        const textEditing = state.mode === 'textEditing' && state.textEditMode.entityId === entity.id;
        return {
            camera: state.camera,
            textEditing,
            editStartPoint: state.textEditMode.editStartPoint,
            highlighted:
                textEditing ||
                state.selectMode.entityIds.includes(entity.id) ||
                (state.hover.type === 'entity' && state.hover.entityId === entity.id),
        };
    });

    return (
        <EditableTextView
            box={TextEntity.getBoundingBox(entity)}
            camera={camera}
            editing={textEditing}
            highlighted={highlighted}
            fillColor="transparent"
            strokeColor="transparent"
            textColor={ColorPalette[entity.palette].strokeColor}
            horizontalAlign={entity.horizontalAlign}
            verticalAlign={entity.verticalAlign}
            value={entity.text}
            editStartPoint={editStartPoint}
            onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
            onMouseLeave={controller.onUnhover}
            onChange={(ev) => controller.setEntityText(entity.id, ev.target.value)}
            onContentSizeChange={(width, height) => {
                controller.updateEntities({
                    [entity.id]: {
                        contentSize: { width, height },
                    },
                });
            }}
        />
    );
};
