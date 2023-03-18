import { Store } from '../../lib/Store';
import { Camera } from '../../model/Camera';
import { Entity } from '../../model/Entity';
import { EditorState } from './EditorState';

export abstract class EditorController {
    constructor(public readonly store: Store<EditorState>) {}

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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEntityMouseOver(entity: Entity) {
        this.store.setState({ hoveredEntity: entity });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEntityMouseLeave(entity: Entity) {
        this.store.setState({ hoveredEntity: null });
    }
}
