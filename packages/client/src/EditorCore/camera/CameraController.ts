import { MYZoomEvent } from '../model/MYZoomEvent';
import { MYScrollEvent } from '../model/MYScrollEvent';
import { MouseEventButton } from '../model/MouseEventButton';
import { MYDragEvent } from '../model/MYDragEvent';
import { GestureRecognizer } from '../gesture/GestureRecognizer';
import { EditorViewEvents } from '../EditorViewEvents/EditorViewEvents';
import { Store } from '@drawing/common/src/lib/Store';
import { Camera } from '@drawing/common/src/model/Camera';
import { Point } from '@drawing/common/src/model/Point';

export class CameraController {
    readonly store = new Store<Camera>(Camera.create());

    constructor(
        private readonly editorViewEvents: EditorViewEvents,
        private readonly gestureRecognizer: GestureRecognizer
    ) {
        editorViewEvents.onZoom.addListener(this.handleZoom);
        editorViewEvents.onScroll.addListener(this.handleScroll);
        gestureRecognizer.onDragStart.addListener(this.handleDragStart);
    }

    get camera(): Camera {
        return this.store.state;
    }

    setCamera(camera: Camera) {
        this.store.setState(camera);
    }

    private readonly handleZoom = (ev: MYZoomEvent) => {
        const camera = this.camera;
        const currentPoint = ev.point;
        const newScale = Math.max(0.1, Math.min(camera.scale + ev.diff, 5));

        this.setCamera(Camera.setScale(camera, currentPoint, newScale));
    };

    private readonly handleScroll = (ev: MYScrollEvent) => {
        const camera = this.camera;
        const point = Point.model(camera.point.x + ev.diff.width, camera.point.y + ev.diff.height);

        this.setCamera({ ...camera, point });
    };

    private readonly handleDragStart = (ev: MYDragEvent) => {
        if (ev.button === MouseEventButton.WHEEL) {
            ev.session.onUpdate.addListener(() => {
                const camera = this.camera;

                this.setCamera({
                    ...camera,
                    point: Point.model(
                        ev.session.startPoint.x - ev.session.currentPointInDisplay.x / camera.scale,
                        ev.session.startPoint.y - ev.session.currentPointInDisplay.y / camera.scale
                    ),
                });
            });
        }
    };
}
