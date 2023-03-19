import { Store } from '../../../lib/Store';
import { Entity } from '../../../model/entity/Entity';
import { Camera } from '../model/Camera';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
import { EventInfo } from '../model/EventInfo';
import { Transaction } from '../model/transaction/Transaction';

export abstract class EditorController {
    constructor(public readonly store: Store<EditorState>) {}

    setMode(mode: EditorMode) {
        this.store.setState({ mode });
    }

    onZoom(fxInDisplay: number, fyInDisplay: number, diff: number) {
        this.store.setState(({ camera }) => {
            const fx = fxInDisplay / camera.scale + camera.x;
            const fy = fyInDisplay / camera.scale + camera.y;
            const newScale = Math.max(0.1, Math.min(camera.scale + diff, 5));

            return { camera: Camera.setScale(camera, fx, fy, newScale) };
        });
    }

    onScroll(dxInDisplay: number, dyInDisplay: number) {
        this.store.setState(({ camera }) => ({
            camera: {
                x: camera.x + dxInDisplay / camera.scale,
                y: camera.y + dyInDisplay / camera.scale,
            },
        }));
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMouseDown(x: number, y: number) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEntityMouseDown(entity: Entity, info: EventInfo) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEntityMouseOver(entity: Entity) {
        this.store.setState({ hoveredEntity: entity });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onEntityMouseLeave(entity: Entity) {
        this.store.setState({ hoveredEntity: null });
    }

    applyTransaction(transaction: Transaction) {
        this.store.setState((prevState) => transaction.redo(prevState));
    }
}
