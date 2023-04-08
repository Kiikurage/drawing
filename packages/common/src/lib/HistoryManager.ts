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

    apply(normal: EditAction, reverse: EditAction) {
        this.redoStack.length = 0;
        this.undoStack.push({ normal: [normal], reverse: [reverse] });
    }

    undo() {
        const entry = this.undoStack.pop();
        if (entry === undefined) return;

        for (const action of entry.reverse) this.onAction.dispatch(action);

        this.redoStack.push(entry);
    }

    redo() {
        const entry = this.redoStack.pop();
        if (entry === undefined) return;

        for (const action of entry.normal) this.onAction.dispatch(action);

        this.undoStack.push(entry);
    }

    readonly onAction = dispatcher<EditAction>();
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
