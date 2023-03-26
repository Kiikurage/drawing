import { Box } from '../../../../model/Box';
import { RectEntity } from '../../../../model/entity/RectEntity';
import { useSlice } from '../../../hooks/useStore';
import { useEditorController } from '../../EditorControllerContext';
import { ColorPalette } from '../../model/ColorPalette';
import { EditableTextView } from './EditableTextView';

export const RectEntityView = ({ entity }: { entity: RectEntity }) => {
    const controller = useEditorController();
    const { camera, textEditing, highlighted } = useSlice(controller.store, (state) => ({
        camera: state.camera,
        textEditing: state.textEditMode.editing && state.textEditMode.entityId === entity.id,
        highlighted:
            state.selectMode.entityIds.includes(entity.id) ||
            (state.hover.type === 'entity' && state.hover.entityId === entity.id),
    }));

    return (
        <EditableTextView
            box={Box.model(entity.p1.x, entity.p1.y, entity.size.width, entity.size.height)}
            camera={camera}
            editing={textEditing}
            highlighted={highlighted}
            fillColor={ColorPalette[entity.palette].fillColor}
            strokeColor={ColorPalette[entity.palette].strokeColor}
            textColor="#000"
            horizontalAlign={entity.horizontalAlign}
            verticalAlign={entity.verticalAlign}
            value={entity.text}
            onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
            onMouseLeave={controller.onUnhover}
            onChange={(ev) => controller.setEntityText(entity.id, ev.target.value)}
            onBlur={() => controller.completeTextEdit()}
            onTextOverflow={(contentHeight) => {
                controller.editController.updateEntities({
                    [entity.id]: { size: { height: contentHeight } },
                });
            }}
        />
    );
};
