import { Box } from '../../../../model/Box';
import { TextEntity } from '../../../../model/entity/TextEntity';
import { useSlice } from '../../../hooks/useStore';
import { useEditorController } from '../../EditorControllerContext';
import { ColorPalette } from '../../model/ColorPalette';
import { EditableTextView } from './EditableTextView';

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
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
            fillColor="transparent"
            strokeColor="transparent"
            textColor={ColorPalette[entity.palette].strokeColor}
            value={entity.text}
            onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
            onMouseLeave={controller.onUnhover}
            onChange={(ev) => controller.setEntityText(entity.id, ev.target.value)}
            onBlur={() => controller.completeTextEdit()}
        />
    );
};
