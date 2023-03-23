import { EditorController } from '../../controllers/EditorController';

export interface Session {
    start?: (controller: EditorController) => void;

    update?: (controller: EditorController) => void;

    complete?: (controller: EditorController) => void;
}
