import { Editor, MouseEventInfo } from '../../controller/Editor';
import { Extension } from '../../controller/Extension';
import { DisplayCordPoint, Entity, Point, Store } from '@drawing/common';
import { PageEditSession } from '../../controller/PageEditSession';
import { ModeExtension } from '../../../extensions/mode/ModeExtension';
import { SelectExtension, SelectionChangeEventInfo } from '../select/SelectExtension';
import { TextEditState } from './TextEditState';

export class TextEditExtension extends Extension {
    readonly store = new Store(TextEditState.create());
    private modeExtension: ModeExtension = null as never;
    private selectExtension: SelectExtension = null as never;
    private session: PageEditSession | null = null;
    private autoCommit = false;

    initialize(controller: Editor) {
        super.initialize(controller);

        this.selectExtension = controller.requireExtension(SelectExtension);
        this.selectExtension.onSelectionChange.addListener(this.handleSelectionChange);

        this.modeExtension = controller.requireExtension(ModeExtension);

        controller.onDoubleClick.addListener(this.handleDoubleClick);
        controller.keyboard
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
        this.session.updateEntities({ [entityId]: { text } });
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

    private readonly handleDoubleClick = (ev: MouseEventInfo) => {
        this.tryStartTextEditForSelectedEntity(ev.pointInDisplay);
    };

    private readonly handleSelectionChange = (ev: SelectionChangeEventInfo) => {
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