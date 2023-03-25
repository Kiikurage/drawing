import { DisplayCordPoint, ModelCordPoint, Point } from '../../../../model/Point';
import { EditorController } from '../../controller/EditorController';
import { Camera } from '../Camera';
import { Session } from './Session';

export class ScrollSession implements Session {
    public prevPoint: DisplayCordPoint;
    public prevCamera: Camera;

    constructor(prevPoint: ModelCordPoint, prevCamera: Camera) {
        this.prevPoint = Point.toDisplay(prevCamera, prevPoint);
        this.prevCamera = prevCamera;
    }

    update(controller: EditorController) {
        const { camera } = controller.state;
        const currentPoint = Point.toDisplay(camera, controller.currentPoint);

        controller.moveCamera(
            Point.model(
                this.prevCamera.point.x + this.prevPoint.x / this.prevCamera.scale - currentPoint.x / camera.scale,
                this.prevCamera.point.y + this.prevPoint.y / this.prevCamera.scale - currentPoint.y / camera.scale
            )
        );
    }
}
