import { Store } from '../../lib/Store';
import { Camera } from '../../model/Camera';
import { Entity } from '../../model/Entity';
import { EditorState } from './EditorState';

export abstract class EditorController {
    constructor(protected readonly store: Store<EditorState>) {}

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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMouseDown(x: number, y: number) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEntityMouseDown(entity: Entity) {}
}
