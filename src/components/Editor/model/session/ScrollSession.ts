import { Patch } from '../../../../model/Patch';
import { DisplayCordPoint, ModelCordPoint, Point } from '../../../../model/Point';
import { EditorController } from '../../controllers/EditorController';
import { Camera } from '../Camera';
import { EditorState } from '../EditorState';
import { Session } from './Session';

export class ScrollSession extends Session {
    readonly type = 'Scroll';
    public originPoint: DisplayCordPoint;
    public prevCamera: Camera;

    constructor(originPoint: ModelCordPoint, prevCamera: Camera) {
        super();
        this.originPoint = Point.toDisplay(prevCamera, originPoint);
        this.prevCamera = prevCamera;
    }

    update(controller: EditorController): Patch<EditorState> {
        const { camera } = controller.state;
        const currentPoint = Point.toDisplay(camera, controller.currentPoint);

        return {
            camera: {
                point: {
                    x:
                        this.prevCamera.point.x +
                        this.originPoint.x / this.prevCamera.scale -
                        currentPoint.x / camera.scale,
                    y:
                        this.prevCamera.point.y +
                        this.originPoint.y / this.prevCamera.scale -
                        currentPoint.y / camera.scale,
                },
            },
        };
    }
}
