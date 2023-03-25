import { EditorController } from '../../controller/EditorController';
import { KeyboardEventInfo } from '../MouseEventInfo';

export interface Session {
    start?: (controller: EditorController) => void;

    update?: (controller: EditorController) => void;

    complete?: (controller: EditorController) => void;

    onKeyDown?: (controller: EditorController, ev: KeyboardEventInfo) => void;
    onKeyUp?: (controller: EditorController, ev: KeyboardEventInfo) => void;
}
