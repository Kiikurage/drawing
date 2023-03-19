import { ModelCordPoint } from '../../../../model/Point';
import { Camera } from '../../model/Camera';
import { EventInfo } from '../../model/EventInfo';
import { HoverState } from '../../model/HoverState';
import { EditorController } from '../EditorController';

export abstract class EditorModeController {
    onAfterActivate?: () => void;

    onBeforeDeactivate?: () => void;

    onMouseDown?: (info: EventInfo) => void;
    onMouseMove?: (prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) => void;
    onMouseUp?: () => void;
    onHover?: (state: HoverState) => void;
    onUnhover?: (state: HoverState) => void;

    constructor(public readonly editorController: EditorController) {}

    get store() {
        return this.editorController.store;
    }

    get state() {
        return this.store.state;
    }

    // Event handler
    onZoom = (diff: number) => {
        this.store.setState(({ camera }) => {
            const newScale = Math.max(0.1, Math.min(camera.scale + diff, 5));

            return { camera: Camera.setScale(camera, this.editorController.currentPoint, newScale) };
        });
    };

    onScroll = (dx: number, dy: number) => {
        this.store.setState(({ camera }) => ({
            camera: {
                point: ModelCordPoint({
                    x: camera.point.x + dx,
                    y: camera.point.y + dy,
                }),
            },
        }));
    };
}
