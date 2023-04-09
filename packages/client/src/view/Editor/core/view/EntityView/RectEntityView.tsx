import { useSlice } from '../../../../hooks/useStore';
import { useEditor, useExtension } from '../EditorControllerContext';
import { EditableTextView } from './EditableTextView';
import { Box, ColorPalette, RectEntity } from '@drawing/common';
import { TextEditExtension } from '../../extensions/textEdit/TextEditExtension';
import { SelectExtension } from '../../extensions/select/SelectExtension';

export const RectEntityView = ({ entity }: { entity: RectEntity }) => {
    const editor = useEditor();
    const { camera, hovered } = useSlice(editor.store, (state) => {
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
            editStartPoint={editStartPoint}
            onMouseOver={() => editor.handleHover({ type: 'entity', entityId: entity.id })}
            onMouseLeave={editor.handleUnhover}
            onChange={(ev) => textEditExtension.updateEditingText(entity.id, ev.target.value)}
            onContentSizeChange={(contentWidth, contentHeight) => {
                editor.updateEntities({
                    [entity.id]: {
                        size: {
                            width: Math.max(contentWidth, entity.size.width),
                            height: Math.max(contentHeight, entity.size.height),
                        },
                    },
                });
            }}
        />
    );
};
