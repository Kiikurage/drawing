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
            this.store.setState({
                page: {
                    entities: {
                        ...Record.mapValue(this.store.state.page.entities, () => undefined),
                        ...this.page.entities(),
                    },
                },
            });
        });
    }

    addEntities(entities: EntityMap) {
        this.saveSnapshot();
        const actions = Object.values(entities).map((entity) => this.page.addEntity(entity));
        this.pushActions(actions);
        this.store.setState({ page: { entities: this.page.entities() } });
        this.syncToDB();
    }

    deleteEntities(entityIds: string[]) {
        const entities = Record.mapToRecord(entityIds, (id) => [id, undefined]);
        const selectedEntityIds = this.store.state.selectedEntityIds.filter((id) => !entityIds.includes(id));

        this.saveSnapshot();
        const actions = entityIds.map((entityId) => this.page.deleteEntity(entityId));
        this.pushActions(actions);
        this.store.setState({
            page: { entities },
            selectedEntityIds,
        });
        this.syncToDB();
    }

    updateEntities(entities: EntityMap) {
        this.saveSnapshot();
        const actions = Object.values(entities).map((entity) => this.page.updateEntity(entity.id, 'transform', entity));
        this.pushActions(actions);
        this.store.setState({
            page: { entities },
        });
        this.syncToDB();
    }

    setColor(color: string) {
        const entityIds = this.store.state.selectedEntityIds;

        const patch: Patch<Entity> = { strokeColor: color, fillColor: lighten(0.3, color) };
        this.saveSnapshot();
        const actions = entityIds.map((entityId) => this.page.updateEntity(entityId, 'style', patch));
        this.pushActions(actions);
        const entitiesPatch = Record.mapToRecord(entityIds, (id) => [id, patch]);
        this.store.setState({ page: { entities: entitiesPatch } });
        this.syncToDB();
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

        this.syncToDB();
    }

    redo() {
        const page = this.redoStack.pop();
        if (page === undefined) return;

        const currentPage = this.store.state.page;
        this.store.setState({ page });
        this.undoStack.push(currentPage);

        this.syncToDB();
    }

    saveSnapshot() {
        this.undoStack.push(this.store.state.page);
        this.redoStack.length = 0;
    }

    syncToDB() {
        this.collaborationController.savePage(this.store.state.page);
    }
}
