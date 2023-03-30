import { ModelCordPoint, Point } from '../../../model/Point';
import { Camera } from '../model/Camera';
import { MouseEventButton, MouseEventInfo } from '../model/MouseEventInfo';
import { EditorController, MouseEvent, ScrollEvent, ZoomEvent } from './EditorController';
import { Extension } from './Extension';

export class CameraExtension implements Extension {
    private controller: EditorController = null as never;
    private dragStartPosition: ModelCordPoint | null = null;

    onActivate(controller: EditorController) {
        this.controller = controller;
        controller.onZoom.addListener(this.onZoom);
        controller.onScroll.addListener(this.onScroll);
        controller.onMouseDown.addListener(this.onMouseDown);
        controller.onMouseMove.addListener(this.onMouseMove);
        controller.onMouseUp.addListener(this.onMouseUp);
    }

    private readonly onZoom = ({ diff }: ZoomEvent) => {
        const camera = this.controller.camera;
        const currentPoint = this.controller.currentPoint;
        const newScale = Math.max(0.1, Math.min(camera.scale + diff, 5));

        this.controller.setCamera(Camera.setScale(camera, currentPoint, newScale));
    };

    private readonly onScroll = ({ diff }: ScrollEvent) => {
        const camera = this.controller.camera;
        const point = Point.model(camera.point.x + diff.width, camera.point.y + diff.height);

        this.controller.setCamera({ ...camera, point });
    };

    onMouseDown = (ev: MouseEventInfo) => {
        if (ev.button === MouseEventButton.WHEEL) {
            this.dragStartPosition = this.controller.currentPoint;
        }
    };

    onMouseMove = ({ pointInDisplay }: MouseEvent) => {
        if (this.dragStartPosition === null) return;

        const camera = this.controller.camera;

        this.controller.setCamera({
            ...camera,
            point: Point.model(
                this.dragStartPosition.x - pointInDisplay.x / camera.scale,
                this.dragStartPosition.y - pointInDisplay.y / camera.scale
            ),
        });
    };

    onMouseUp = () => {
        this.dragStartPosition = null;
    };
}
