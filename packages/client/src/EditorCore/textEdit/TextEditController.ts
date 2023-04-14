import { DisplayCordPoint, Entity, Point, Store } from '@drawing/common';
import { PageEditSession } from '../PageController/PageEditSession';
import { TextEditState } from './TextEditState';
import { SelectionChangeEvent } from '../model/SelectionChangeEvent';
import { MYMouseEvent } from '../model/MYMouseEvent';
import { SelectionController } from '../selection/SelectionController';
import { EditorViewEvents } from '../EditorViewEvents/EditorViewEvents';
import { PageController } from '../PageController/PageController';
import { Command } from '../CommandManager/Command';
import { KeyboardShortcutCommandManager } from '../CommandManager/KeyboardShortcutCommandManager';

export class TextEditController {
    readonly store = new Store(TextEditState.create());
    private session: PageEditSession | null = null;
    private autoCommit = false;

    constructor(
        private readonly selectionController: SelectionController,
        private readonly editorViewEvents: EditorViewEvents,
        private readonly pageController: PageController,
        private readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager
    ) {
        this.selectionController.onChange.addListener(this.handleSelectionChange);

        editorViewEvents.onDoubleClick.addListener(this.handleDoubleClick);

        const startEditTextCommand = Command('startEditText', 'Edit text of selected object', () =>
            this.tryStartTextEditForSelectedEntity()
        );
        this.keyboardShortcutCommandManager.set(['Enter'], startEditTextCommand);

        const finishEditTextCommand = Command('finishEditText', 'Finish text editing', () => this.completeTextEdit());
        this.keyboardShortcutCommandManager.set(['Escape'], finishEditTextCommand);
    }

    tryStartTextEditForSelectedEntity(editStartPoint = Point.display(0, 0)) {
        if (this.checkIfHoveredEntityTextEditable()) {
            this.startTextEdit(this.selectionController.selectedEntityIds[0], { editStartPoint });
        }
    }

    startTextEdit(
        entityId: string,
        options?: {
            editStartPoint?: DisplayCordPoint;
            session?: PageEditSession;
            autoCommit?: boolean;
        }
    ) {
        this.session = options?.session ?? this.pageController.newSession();
        this.autoCommit = options?.autoCommit ?? true;

        const entity = this.pageController.page.entities[entityId];
        if (entity === undefined) return;

        this.store.setState({ entityId, editStartPoint: options?.editStartPoint ?? Point.display(0, 0) });
    }

    updateEditingText(entityId: string, text: string) {
        if (this.session === null) return;
        this.session.updateEntities({ [entityId]: { text } });
    }

    completeTextEdit() {
        if (this.autoCommit) this.session?.commit();
        this.session = null;

        this.store.setState({ entityId: '' });
        this.selectionController.unselectAllEntities();
    }

    private checkIfHoveredEntityTextEditable(): boolean {
        const selectedEntity = this.selectionController.selectedEntities[0];
        if (selectedEntity === undefined) return false;
        if (!Entity.isTextEditable(selectedEntity)) return false;

        return true;
    }

    private readonly handleDoubleClick = (ev: MYMouseEvent) => {
        this.tryStartTextEditForSelectedEntity(ev.pointInDisplay);
    };

    private readonly handleSelectionChange = (ev: SelectionChangeEvent) => {
        if (this.store.state.entityId !== '') {
            if (!ev.nextEntityIds.includes(this.store.state.entityId)) {
                this.completeTextEdit();
            }
        }

        // Clean up empty text entity
        const { prevEntityIds, nextEntityIds } = ev;
        const unselectedEntityIds = prevEntityIds.filter((entityId) => !nextEntityIds.includes(entityId));

        for (const entityId of unselectedEntityIds) {
            const entity = this.pageController.page.entities[entityId];
            if (!entity) continue;

            if (entity.type === 'text') {
                if (entity.text.trim() === '') {
                    this.pageController.deleteEntities([entity.id]);
                }
            }
        }
    };
}
