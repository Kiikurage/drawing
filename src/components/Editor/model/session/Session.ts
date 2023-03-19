import { Patch } from '../../../../model/Patch';
import { EditorController } from '../../controllers/EditorController';
import { EditorState } from '../EditorState';

export interface Session {
    update(controller: EditorController): Patch<EditorState>;
}
