import { Action } from '../model/page/action/Action';
import { dispatcher } from './Dispatcher';

interface HistoryEntry {
    normal: Action[];
    inverse: Action[];
}

export class HistoryManager {
    private readonly undoStack: HistoryEntry[] = [];
    private readonly redoStack: HistoryEntry[] = [];

    newSession(): HistoryManager.Session {
        const session = new SessionImpl();

        session.onCommit.addListener((entry: HistoryEntry) => this.undoStack.push(entry));

        return session;
    }

    addEntry(normal: Action, inverse: Action) {
        this.redoStack.length = 0;
        this.undoStack.push({ normal: [normal], inverse: [inverse] });
    }

    undo(): Action[] {
        const entry = this.undoStack.pop();
        if (entry === undefined) return [];

        this.redoStack.push(entry);

        return entry.inverse;
    }

    redo(): Action[] {
        const entry = this.redoStack.pop();
        if (entry === undefined) return [];

        this.undoStack.push(entry);

        return entry.normal;
    }
}

export module HistoryManager {
    export interface Session {
        apply(normal: Action, inverse: Action): void;

        commit(): void;
    }
}

class SessionImpl implements HistoryManager.Session {
    private normalActions: Action[] = [];
    private inverseActions: Action[] = [];
    private isCommit = false;

    readonly onCommit = dispatcher<HistoryEntry>();

    apply(normal: Action, inverse: Action) {
        if (this.isCommit) {
            throw new Error('This session is already committed');
        }

        this.normalActions.push(normal);
        this.inverseActions.push(inverse);
    }

    commit(): void {
        this.onCommit.dispatch({
            normal: this.normalActions,
            inverse: this.inverseActions.reverse(),
        });

        this.isCommit = true;
    }
}
