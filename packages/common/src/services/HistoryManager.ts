import { noop } from '../lib/noop';
import { EditAction } from '../model/EditAction';

interface HistoryEntry {
    normal: EditAction[];
    reverse: EditAction[];
}

export class HistoryManager {
    private readonly undoStack: HistoryEntry[] = [];
    private readonly redoStack: HistoryEntry[] = [];

    newSession(): HistoryManager.Session {
        return new SessionImpl(
            (action: EditAction) => {
                this.redoStack.length = 0;
                this.onAction(action);
            },
            (entry: HistoryEntry) => {
                this.undoStack.push(entry);
            }
        );
    }

    apply(normal: EditAction, reverse: EditAction) {
        this.redoStack.length = 0;
        this.onAction(normal);
        this.undoStack.push({ normal: [normal], reverse: [reverse] });
    }

    undo() {
        const entry = this.undoStack.pop();
        if (entry === undefined) return;

        for (const action of entry.reverse) this.onAction(action);

        this.redoStack.push(entry);
    }

    redo() {
        const entry = this.redoStack.pop();
        if (entry === undefined) return;

        for (const action of entry.normal) this.onAction(action);

        this.undoStack.push(entry);
    }

    onAction: (patch: EditAction) => void = noop;
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

    constructor(
        private readonly onAction: (action: EditAction) => void,
        private readonly onCommit: (entry: HistoryEntry) => void
    ) {}

    apply(normal: EditAction, reverse: EditAction) {
        if (this.isCommit) {
            throw new Error('This session is already committed');
        }

        this.onAction(normal);
        this.normalActions.push(normal);
        this.reverseActions.push(reverse);
    }

    commit(): void {
        this.onCommit({
            normal: this.normalActions,
            reverse: this.reverseActions.reverse(),
        });

        this.isCommit = true;
    }
}
