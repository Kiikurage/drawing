import { Action } from '../model/page/action/Action';
import { dispatcher } from './Dispatcher';

interface HistoryEntry {
    normal: Action[];
    reverse: Action[];
}

export class HistoryManager {
    private readonly undoStack: HistoryEntry[] = [];
    private readonly redoStack: HistoryEntry[] = [];

    newSession(): HistoryManager.Session {
        const session = new SessionImpl();

        session.onCommit.addListener((entry: HistoryEntry) => this.undoStack.push(entry));

        return session;
    }

    addEntry(normal: Action, reverse: Action) {
        this.redoStack.length = 0;
        this.undoStack.push({ normal: [normal], reverse: [reverse] });
    }

    undo(): Action[] {
        const entry = this.undoStack.pop();
        if (entry === undefined) return [];

        this.redoStack.push(entry);

        return entry.reverse;
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
        apply(normal: Action, reverse: Action): void;

        commit(): void;
    }
}

class SessionImpl implements HistoryManager.Session {
    normalActions: Action[] = [];
    reverseActions: Action[] = [];
    private isCommit = false;

    readonly onCommit = dispatcher<HistoryEntry>();

    apply(normal: Action, reverse: Action) {
        if (this.isCommit) {
            throw new Error('This session is already committed');
        }

        this.normalActions.push(normal);
        this.reverseActions.push(reverse);
    }

    commit(): void {
        this.onCommit.dispatch({
            normal: this.normalActions,
            reverse: this.reverseActions.reverse(),
        });

        this.isCommit = true;
    }
}
