import { Box } from '../../../../model/Box';
import { RectEntity } from '../../../../model/entity/RectEntity';
import { useStore } from '../../../hooks/useStore';
import { useEditorController } from '../../EditorControllerContext';
import { ColorPalette } from '../../model/ColorPalette';
import { EditableTextView } from '../EditableTextView';

export const RectEntityView = ({ entity }: { entity: RectEntity }) => {
    const controller = useEditorController();
    const {
        camera,
        textEditMode: { editing, entityId: editingEntityId },
    } = useStore(controller.store);

    return (
        <EditableTextView
            box={Box.model(entity.p1.x, entity.p1.y, entity.size.width, entity.size.height)}
            camera={camera}
            editing={editing && editingEntityId === entity.id}
            fillColor={ColorPalette[entity.palette].fillColor}
            strokeColor={ColorPalette[entity.palette].strokeColor}
            textColor="#000"
            value={entity.text}
            onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
            onMouseLeave={controller.onUnhover}
            onChange={(ev) => controller.setEntityText(entity.id, ev.target.value)}
            onBlur={() => controller.completeTextEdit()}
        />
    );
};
