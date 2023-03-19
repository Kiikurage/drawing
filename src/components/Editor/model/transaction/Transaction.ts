import { EditorState } from '../EditorState';

export interface Transaction {
    undo(nextState: EditorState): EditorState;

    redo(prevState: EditorState): EditorState;
}
