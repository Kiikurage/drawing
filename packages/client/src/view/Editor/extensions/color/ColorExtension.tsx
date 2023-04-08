import { Extension } from '../../core/controller/Extension';
import { ColorPaletteKey, Record } from '@drawing/common';
import { EditorController } from '../../core/controller/EditorController';
import { ContextMenuExtension } from '../../core/extensions/contextMenu/ContextMenuExtension';
import { ColorContextMenuSection } from './ColorContextMenuSection';
import { SelectExtension } from '../../core/extensions/select/SelectExtension';

export class ColorExtension extends Extension {
    private selectExtension: SelectExtension = null as never;

    initialize(controller: EditorController) {
        super.initialize(controller);
        controller.requireExtension(ContextMenuExtension).addSection({
            view: ColorContextMenuSection,
        });

        this.selectExtension = controller.requireExtension(SelectExtension);
    }

    setColor(entityIds: string[], palette: ColorPaletteKey) {
        this.controller.updateEntities(Record.mapToRecord(entityIds, (entityId) => [entityId, { palette }]));
    }

    setColorForSelectedEntities(palette: ColorPaletteKey) {
        this.setColor(this.selectExtension.selectedEntityIds, palette);
    }
}
