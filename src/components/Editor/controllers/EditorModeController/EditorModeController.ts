import { ModelCordPoint, Point } from '../../../../model/Point';
import { ModelCordSize } from '../../../../model/Size';
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
        const newScale = Math.max(0.1, Math.min(this.state.camera.scale + diff, 5));

        this.store.setState({
            camera: Camera.setScale(this.state.camera, this.editorController.currentPoint, newScale),
        });
    };

    onScroll = (diff: ModelCordSize) => {
        this.store.setState({
            camera: {
                point: Point.model({
                    x: this.state.camera.point.x + diff.width,
                    y: this.state.camera.point.y + diff.height,
                }),
            },
        });
    };
}
