import { Extension } from '../../core/controller/Extension';
import { EntityMap, Patch, randomId, Record } from '@drawing/common';
import { Editor } from '../../core/controller/Editor';
import { SelectExtension } from '../../core/extensions/select/SelectExtension';

export class ClipboardExtension extends Extension {
    private selectExtension: SelectExtension = null as never;

    initialize(controller: Editor) {
        super.initialize(controller);

        this.selectExtension = controller.requireExtension(SelectExtension);

        controller.keyboard
            .addPatternListener(['Control', 'X'], (ev) => {
                ev.preventDefault();
                this.cut();
            })
            .addPatternListener(['Control', 'C'], (ev) => {
                ev.preventDefault();
                this.copy();
            })
            .addPatternListener(['Control', 'V'], (ev) => {
                ev.preventDefault();
                this.paste();
            });
    }

    cut() {
        const selectedEntities = this.selectExtension.selectedEntityMap;
        if (Record.size(selectedEntities) === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));

        this.controller.deleteEntities(this.selectExtension.selectedEntityIds);
    }

    copy() {
        const selectedEntities = this.selectExtension.selectedEntityMap;
        if (Record.size(selectedEntities) === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));
    }

    async paste() {
        const json = await navigator.clipboard.readText();
        let copiedEntities: EntityMap;
        try {
            copiedEntities = JSON.parse(json);
        } catch (ignored) {
            return;
        }
        const entities = Record.map(copiedEntities, (_, entity) => {
            const id = randomId();
            return [id, Patch.apply(entity, { id })];
        });

        this.controller.addEntities(entities);
        this.selectExtension.setSelection(Object.keys(entities));
    }
}
