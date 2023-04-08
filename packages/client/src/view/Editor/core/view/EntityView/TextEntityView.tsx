import { ColorPalette, TextEntity } from '@drawing/common';
import { useEditorController, useExtension } from '../EditorControllerContext';
import { useSlice } from '../../../../hooks/useStore';
import { EditableTextView } from './EditableTextView';
import { TextEditExtension } from '../../extensions/textEdit/TextEditExtension';
import { SelectExtension } from '../../extensions/select/SelectExtension';

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
    const controller = useEditorController();
    const { camera, hovered } = useSlice(controller.store, (state) => {
        return {
            camera: state.camera,
            hovered: state.hover.type === 'entity' && state.hover.entityId === entity.id,
        };
    });

    const textEditExtension = useExtension(TextEditExtension);
    const { textEditing, editStartPoint } = useSlice(textEditExtension.store, (state) => {
        return {
            textEditing: state.entityId === entity.id,
            editStartPoint: state.editStartPoint,
        };
    });

    const selectExtension = useExtension(SelectExtension);
    const { selected } = useSlice(selectExtension.store, (state) => {
        return { selected: entity.id in state.entities };
    });

    const highlighted = selected || hovered;

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
            onMouseOver={() => controller.handleHover({ type: 'entity', entityId: entity.id })}
            onMouseLeave={controller.handleUnhover}
            onChange={(ev) => textEditExtension.updateEditingText(entity.id, ev.target.value)}
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
