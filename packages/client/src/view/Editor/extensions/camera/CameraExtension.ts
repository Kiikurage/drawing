import { Editor, MouseEventButton, MouseEventInfo, ScrollEvent, ZoomEvent } from '../../core/controller/Editor';
import { Extension } from '../../core/controller/Extension';
import { Camera, ModelCordPoint, Point } from '@drawing/common';

export class CameraExtension extends Extension {
    private dragStartPosition: ModelCordPoint | null = null;

    initialize(controller: Editor) {
        super.initialize(controller);
        controller.onZoom.addListener(this.handleZoom);
        controller.onScroll.addListener(this.handleScroll);
        controller.onMouseDown.addListener(this.handleMouseDown);
        controller.onMouseMove.addListener(this.handleMouseMove);
        controller.onMouseUp.addListener(this.handleMouseUp);
    }

    setCamera(camera: Camera) {
        this.controller.store.setState({ camera });
    }

    private readonly handleZoom = (ev: ZoomEvent) => {
        const camera = this.controller.camera;
        const currentPoint = ev.point;
        const newScale = Math.max(0.1, Math.min(camera.scale + ev.diff, 5));

        this.setCamera(Camera.setScale(camera, currentPoint, newScale));
    };

    private readonly handleScroll = (ev: ScrollEvent) => {
        const camera = this.controller.camera;
        const point = Point.model(camera.point.x + ev.diff.width, camera.point.y + ev.diff.height);

        this.setCamera({ ...camera, point });
    };

    private readonly handleMouseDown = (ev: MouseEventInfo) => {
        if (ev.button === MouseEventButton.WHEEL) {
            this.dragStartPosition = ev.point;
        }
    };

    private readonly handleMouseMove = (ev: MouseEventInfo) => {
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

    private readonly handleMouseUp = () => {
        this.dragStartPosition = null;
    };
}
