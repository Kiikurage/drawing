import { ModelCordPoint, Point } from '../../../model/Point';
import { EditorController } from './EditorController';

export class ScrollSessionController {
    private readonly startPoint: ModelCordPoint;

    constructor(private readonly controller: EditorController) {
        this.startPoint = controller.currentPoint;
    }

    onMouseMove(prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) {
        const nextPointInDisplay = Point.toDisplay(this.controller.state.camera, nextPoint);

        this.controller.moveCamera(
            Point.model(
                this.startPoint.x - nextPointInDisplay.x / this.controller.state.camera.scale,
                this.startPoint.y - nextPointInDisplay.y / this.controller.state.camera.scale
            )
        );
    }
}
