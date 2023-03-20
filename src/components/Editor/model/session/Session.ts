import { Patch } from '../../../../model/Patch';
import { EditorController } from '../../controllers/EditorController';
import { EditorState } from '../EditorState';

export abstract class Session {
    abstract type: string;

    start(controller: EditorController): Patch<EditorState> {
        return {};
    }

    update(controller: EditorController): Patch<EditorState> {
        return {};
    }

    complete(controller: EditorController): Patch<EditorState> {
        return {};
    }
}
