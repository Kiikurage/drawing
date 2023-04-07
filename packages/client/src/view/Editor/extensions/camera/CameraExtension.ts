import {
    IEditorController,
    MouseEventButton,
    MouseEventInfo,
    ScrollEvent,
    ZoomEvent,
} from '../../core/controller/IEditorController';
import { Extension } from '../../core/controller/Extension';
import { Camera, ModelCordPoint, Point } from '@drawing/common';

export class CameraExtension extends Extension {
    private dragStartPosition: ModelCordPoint | null = null;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);
        controller.onZoom.addListener(this.onZoom);
        controller.onScroll.addListener(this.onScroll);
        controller.onMouseDown.addListener(this.onMouseDown);
        controller.onMouseMove.addListener(this.onMouseMove);
        controller.onMouseUp.addListener(this.onMouseUp);
    }

    setCamera(camera: Camera) {
        this.controller.store.setState({ camera });
    }

    private readonly onZoom = (ev: ZoomEvent) => {
        const camera = this.controller.camera;
        const currentPoint = ev.point;
        const newScale = Math.max(0.1, Math.min(camera.scale + ev.diff, 5));

        this.setCamera(Camera.setScale(camera, currentPoint, newScale));
    };

    private readonly onScroll = (ev: ScrollEvent) => {
        const camera = this.controller.camera;
        const point = Point.model(camera.point.x + ev.diff.width, camera.point.y + ev.diff.height);

        this.setCamera({ ...camera, point });
    };

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        if (ev.button === MouseEventButton.WHEEL) {
            this.dragStartPosition = ev.point;
        }
    };

    private readonly onMouseMove = (ev: MouseEventInfo) => {
        if (this.dragStartPosition === null) return;

        const camera = this.controller.camera;

        this.setCamera({
            ...camera,
            point: Point.model(
                this.dragStartPosition.x - ev.pointInDisplay.x / camera.scale,
                this.dragStartPosition.y - ev.pointInDisplay.y / camera.scale
            ),
        });
    };

    private readonly onMouseUp = () => {
        this.dragStartPosition = null;
    };
}
