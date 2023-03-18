import { Camera } from '../../model/Camera';
import { EditorController } from './EditorController';

export class SelectModeEditorController extends EditorController {
    onZoom(fx: number, fy: number, diff: number) {
        this.store.setState(({ camera }) => {
            const newScale = Math.max(0.1, Math.min(camera.scale - diff, 2));
            return { camera: Camera.setScale(camera, fx, fy, newScale) };
        });
    }

    onScroll(dx: number, dy: number) {
        this.store.setState(({ camera }) => ({
            camera: {
                x: camera.x + dx,
                y: camera.y + dy,
            },
        }));
    }
}
