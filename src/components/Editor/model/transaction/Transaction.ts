import { Patch } from '../../../../model/Patch';
import { EditorController } from '../../controllers/EditorController';
import { EditorState } from '../EditorState';

export interface Transaction {
    update(controller: EditorController): Patch<EditorState>;
}
