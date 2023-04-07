import { Extension } from '../../core/controller/Extension';
import { ColorPaletteKey, Record } from '@drawing/common';
import { IEditorController } from '../../core/controller/IEditorController';
import { ContextMenuExtension } from '../contextMenu/ContextMenuExtension';
import { ColorContextMenuSection } from './ColorContextMenuSection';
import { SelectExtension } from '../select/SelectExtension';

export class ColorExtension extends Extension {
    private selectExtension: SelectExtension = null as never;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);
        controller.requireExtension(ContextMenuExtension).addSection({
            view: ColorContextMenuSection,
        });

        this.selectExtension = controller.requireExtension(SelectExtension);
    }

    setColor(entityIds: string[], palette: ColorPaletteKey) {
        this.controller.updateEntities(
            'style',
            Record.mapToRecord(entityIds, (entityId) => [entityId, { palette }])
        );
    }

    setColorForSelectedEntities(palette: ColorPaletteKey) {
        this.setColor(this.selectExtension.selectedEntityIds, palette);
    }
}
