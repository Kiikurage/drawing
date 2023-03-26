import { ModelCordPoint } from '../../../../model/Point';
import { MouseEventInfo } from '../../model/MouseEventInfo';
import { EditorController } from '../EditorController';

export abstract class EditorModeController {
    onAfterActivate?: () => void;
    onBeforeDeactivate?: () => void;
    onMouseDown?: (info: MouseEventInfo) => void;
    onMouseMove?: (prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) => void;
    onMouseUp?: () => void;

    constructor(public readonly controller: EditorController) {}
}
