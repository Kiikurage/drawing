import { Box } from '../../../../model/Box';
import { TextEntity } from '../../../../model/entity/TextEntity';
import { useStore } from '../../../hooks/useStore';
import { useEditorController } from '../../EditorControllerContext';
import { ColorPalette } from '../../model/ColorPalette';
import { EditableTextView } from '../EditableTextView';

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
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
