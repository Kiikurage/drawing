import { lighten } from 'polished';
import { Record } from '../../../lib/Record';
import { Store } from '../../../lib/Store';
import { Page } from '../../../model/Page';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { CollaborationController } from './CollaborationController/CollaborationController';

export class EditController {
    private readonly undoStack: Page[] = [];
    private readonly redoStack: Page[] = [];

    constructor(
        private readonly store: Store<EditorState>,
        private readonly collaborationController: CollaborationController
    ) {
        this.collaborationController.addUpdateListener(this.store.state.page.id, (nextPage: Page) => {
            this.store.setState({ page: nextPage });
        });
    }

    addEntities(entities: EntityMap) {
        this.saveSnapshot();
        this.store.setState({ page: { entities } });
        this.syncToDB();
    }

    deleteEntities(entityIds: string[]) {
        const entities = Record.mapToRecord(entityIds, (id) => [id, undefined]);
        const selectedEntityIds = this.store.state.selectedEntityIds.filter((id) => !entityIds.includes(id));

        this.saveSnapshot();
        this.store.setState({
            page: { entities },
            selectedEntityIds,
        });
        this.syncToDB();
    }

    updateEntities(entities: EntityMap) {
        this.saveSnapshot();
        this.store.setState({
            page: { entities },
        });
        this.syncToDB();
    }

    setColor(color: string) {
        this.saveSnapshot();
        const entitiesPatch = Record.mapToRecord(this.store.state.selectedEntityIds, (id) => [
            id,
            { strokeColor: color, fillColor: lighten(0.3, color) },
        ]);
        this.store.setState({ page: { entities: entitiesPatch } });
        this.syncToDB();
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
