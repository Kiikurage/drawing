import { IEditorController, MouseEventInfo } from '../../core/controller/IEditorController';
import { Extension } from '../../core/controller/Extension';
import { DisplayCordPoint, Entity, Point, Store } from '@drawing/common';
import { PageEditSession } from '../../core/controller/PageEditSession';
import { ModeExtension } from '../mode/ModeExtension';
import { SelectExtension, SelectionChangeEventInfo } from '../select/SelectExtension';
import { TextEditState } from './TextEditState';

export class TextEditExtension extends Extension {
    readonly store = new Store(TextEditState.create());
    private modeExtension: ModeExtension = null as never;
    private selectExtension: SelectExtension = null as never;
    private session: PageEditSession | null = null;
    private autoCommit = false;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);

        this.selectExtension = controller.requireExtension(SelectExtension);
        this.selectExtension.onSelectionChange.addListener(this.onSelectionChange);

        this.modeExtension = controller.requireExtension(ModeExtension);

        controller.onDoubleClick.addListener(this.onDoubleClick);
        controller.shortcuts
            .addPatternListener(['Enter'], (ev) => {
                ev.preventDefault();
                this.tryStartTextEditForSelectedEntity();
            })
            .addPatternListener(['Escape'], (ev) => {
                ev.preventDefault();
                this.completeTextEdit();
            });
    }

    tryStartTextEditForSelectedEntity(editStartPoint = Point.display(0, 0)) {
        if (this.checkIfHoveredEntityTextEditable()) {
            this.startTextEdit(this.selectExtension.selectedEntityIds[0]!, { editStartPoint });
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
        this.session = options?.session ?? this.controller.newSession();
        this.autoCommit = options?.autoCommit ?? true;

        const entity = this.controller.state.page.entities[entityId];
        if (entity === undefined) return;

        this.store.setState({ entityId, editStartPoint: options?.editStartPoint ?? Point.display(0, 0) });
    }

    updateEditingText(entityId: string, text: string) {
        if (this.session === null) return;
        this.session.updateEntities('text', { [entityId]: { text } });
    }

    completeTextEdit() {
        if (this.autoCommit) this.session?.commit();
        this.session = null;

        this.store.setState({ entityId: '' });
        this.selectExtension.clearSelection();
    }

    private checkIfHoveredEntityTextEditable(): boolean {
        const selectedEntity = this.selectExtension.selectedEntities[0];
        if (selectedEntity === undefined) return false;
        if (!Entity.isTextEditable(selectedEntity)) return false;

        return true;
    }

    private readonly onDoubleClick = (ev: MouseEventInfo) => {
        this.tryStartTextEditForSelectedEntity(ev.pointInDisplay);
    };

    private readonly onSelectionChange = (ev: SelectionChangeEventInfo) => {
        if (this.store.state.entityId !== '') {
            if (!ev.nextEntityIds.includes(this.store.state.entityId)) {
                this.completeTextEdit();
            }
        }

        // Clean up empty text entity
        const { prevEntityIds, nextEntityIds } = ev;
        const unselectedEntityIds = prevEntityIds.filter((entityId) => !nextEntityIds.includes(entityId));

        for (const entityId of unselectedEntityIds) {
            const entity = this.controller.state.page.entities[entityId];
            if (!entity) continue;

            if (entity.type === 'text') {
                if (entity.text.trim() === '') {
                    this.controller.deleteEntities([entity.id]);
                }
            }
        }
    };
}
