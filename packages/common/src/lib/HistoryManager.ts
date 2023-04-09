import { EditAction } from '../model/page/action/EditAction';
import { dispatcher } from './Dispatcher';

interface HistoryEntry {
    normal: EditAction[];
    reverse: EditAction[];
}

export class HistoryManager {
    private readonly undoStack: HistoryEntry[] = [];
    private readonly redoStack: HistoryEntry[] = [];

    newSession(): HistoryManager.Session {
        const session = new SessionImpl();

        session.onCommit.addListener((entry: HistoryEntry) => this.undoStack.push(entry));

        return session;
    }

    addEntry(normal: EditAction, reverse: EditAction) {
        this.redoStack.length = 0;
        this.undoStack.push({ normal: [normal], reverse: [reverse] });
    }

    undo(): EditAction[] {
        const entry = this.undoStack.pop();
        if (entry === undefined) return [];

        this.redoStack.push(entry);

        return entry.reverse;
    }

    redo(): EditAction[] {
        const entry = this.redoStack.pop();
        if (entry === undefined) return [];

        this.undoStack.push(entry);

        return entry.normal;
    }
}

export module HistoryManager {
    export interface Session {
        apply(normal: EditAction, reverse: EditAction): void;

        commit(): void;
    }
}

class SessionImpl implements HistoryManager.Session {
    normalActions: EditAction[] = [];
    reverseActions: EditAction[] = [];
    private isCommit = false;

    readonly onCommit = dispatcher<HistoryEntry>();

    apply(normal: EditAction, reverse: EditAction) {
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
