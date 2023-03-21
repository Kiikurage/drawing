import * as firebaseDB from 'firebase/database';
import { set } from 'firebase/database';
import { lighten } from 'polished';
import { getDatabase } from '../../../firebaseConfig';
import { Record } from '../../../lib/Record';
import { Store } from '../../../lib/Store';
import { CRDTPage, CRDTPageAction } from '../../../model/CRDTPage';
import { Entity } from '../../../model/entity/Entity';
import { Page } from '../../../model/Page';
import { Patch } from '../../../model/Patch';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { CollaborationController } from './CollaborationController/CollaborationController';

export class EditController {
    private page = new CRDTPage();
    private readonly undoStack: Page[] = [];
    private readonly redoStack: Page[] = [];

    constructor(
        private readonly store: Store<EditorState>,
        private readonly collaborationController: CollaborationController
    ) {
        this.page = new CRDTPage(this.store.state.page);
        this.collaborationController.addUpdateListener(this.store.state.page.id, (nextPage: Page) => {
            this.store.setState({ page: nextPage });
        });

        const db = getDatabase();
        const actionsRef = firebaseDB.ref(db, `actions/${this.store.state.page.id}`);

        firebaseDB.onChildAdded(actionsRef, (data) => {
            const action: CRDTPageAction = data.val();
            this.page.apply(action);
            const newEntities = this.page.entities();
            this.store.setState({
                page: {
                    entities: {
                        ...Record.mapValue(this.store.state.page.entities, () => undefined),
                        ...newEntities,
                    },
                },
                selectedEntityIds: this.store.state.selectedEntityIds.filter((id) => id in newEntities),
            });
        });
    }

    addEntities(entities: EntityMap) {
        this.saveSnapshot();
        const actions = Object.values(entities).map((entity) => this.page.addEntity(entity));
        this.pushActions(actions);
    }

    deleteEntities(entityIds: string[]) {
        this.saveSnapshot();
        const actions = entityIds.map((entityId) => this.page.deleteEntity(entityId));
        this.pushActions(actions);
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        this.saveSnapshot();
        const actions = Object.entries(patches).map(([entityId, patch]) =>
            this.page.updateEntity(entityId, 'transform', patch)
        );
        this.pushActions(actions);
    }

    setColor(color: string) {
        this.saveSnapshot();
        const actions = this.store.state.selectedEntityIds.map((entityId) =>
            this.page.updateEntity(entityId, 'style', { strokeColor: color, fillColor: lighten(0.3, color) })
        );
        this.pushActions(actions);
    }

    private pushActions(actions: CRDTPageAction[]) {
        const db = getDatabase();
        const actionsRef = firebaseDB.ref(db, `actions/${this.store.state.page.id}`);

        for (const action of actions) {
            const actionRef = firebaseDB.push(actionsRef);
            set(actionRef, action);
        }
    }

    undo() {
        const page = this.undoStack.pop();
        if (page === undefined) return;

        const currentPage = this.store.state.page;
        this.store.setState({ page });
        this.redoStack.push(currentPage);
    }

    redo() {
        const page = this.redoStack.pop();
        if (page === undefined) return;

        const currentPage = this.store.state.page;
        this.store.setState({ page });
        this.undoStack.push(currentPage);
    }

    saveSnapshot() {
        this.undoStack.push(this.store.state.page);
        this.redoStack.length = 0;
    }
}
