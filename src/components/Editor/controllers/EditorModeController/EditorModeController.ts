import { ModelCordPoint } from '../../../../model/Point';
import { HoverState } from '../../model/HoverState';
import { MouseEventInfo } from '../../model/MouseEventInfo';
import { EditorController } from '../EditorController';

export abstract class EditorModeController {
    // Event handler
    onAfterActivate?: () => void;

    onBeforeDeactivate?: () => void;

    onMouseDown?: (info: MouseEventInfo) => void;
    onMouseMove?: (prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) => void;
    onMouseUp?: () => void;
    onHover?: (state: HoverState) => void;
    onUnhover?: (state: HoverState) => void;

    constructor(public readonly editorController: EditorController) {}
}
