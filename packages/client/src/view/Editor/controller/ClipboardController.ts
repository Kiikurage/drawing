import { Entity, randomId } from '@drawing/common';
import { PageController } from '../../../EditorCore/PageController/PageController';
import { SelectionController } from '../../../EditorCore/selection/SelectionController';
import { Command } from '../../../EditorCore/CommandManager/Command';
import { KeyboardShortcutCommandManager } from '../../../EditorCore/CommandManager/KeyboardShortcutCommandManager';

export class ClipboardController {
    constructor(
        private readonly pageController: PageController,
        private readonly selectionController: SelectionController,
        private readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager
    ) {
        const cutCommand = Command('cut', 'Cut', () => this.cut());
        this.keyboardShortcutCommandManager.set(['Control', 'X'], cutCommand);

        const copyCommand = Command('copy', 'Copy', () => this.copy());
        this.keyboardShortcutCommandManager.set(['Control', 'C'], copyCommand);

        const pasteCommand = Command('paste', 'Paste', () => this.paste());
        this.keyboardShortcutCommandManager.set(['Control', 'V'], pasteCommand);
    }

    cut() {
        const selectedEntities = this.selectionController.selectedEntities;
        if (selectedEntities.length === 0) return;

        this.write(selectedEntities);

        this.pageController.deleteEntities(this.selectionController.selectedEntityIds);
    }

    copy() {
        const selectedEntities = this.selectionController.selectedEntities;
        if (selectedEntities.length === 0) return;

        this.write(selectedEntities);
    }

    async paste() {
        const entities = await this.read();
        if (entities === undefined) return;

        this.pageController.addEntities(entities);
        this.selectionController.setSelection(entities.map((entity) => entity.id));
    }

    write(entities: Entity[]) {
        if (!('clipboard' in navigator)) return;

        navigator.clipboard.writeText(JSON.stringify(entities));
    }

    async read() {
        if (!('clipboard' in navigator)) return;

        const json = await navigator.clipboard.readText();
        let entities: Entity[];
        try {
            entities = JSON.parse(json);
        } catch (ignored) {
            return;
        }
        return entities.map((entity) => ({ ...entity, id: randomId() }));
    }
}
