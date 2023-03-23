import { EditorController } from '../../controllers/EditorController';
import { KeyboardEventInfo } from '../MouseEventInfo';

export interface Session {
    type: string;

    start?: (controller: EditorController) => void;

    update?: (controller: EditorController) => void;

    complete?: (controller: EditorController) => void;

    onKeyDown?: (controller: EditorController, ev: KeyboardEventInfo) => void;
    onKeyUp?: (controller: EditorController, ev: KeyboardEventInfo) => void;
}
