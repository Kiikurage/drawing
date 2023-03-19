import { Store } from '../../../lib/Store';
import { Patch } from '../../../model/Patch';
import { DisplayCordPoint, ModelCordPoint, Point } from '../../../model/Point';
import { Camera } from '../model/Camera';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
import { EventInfo } from '../model/EventInfo';
import { HoverState } from '../model/HoverState';
import { Transaction } from '../model/transaction/Transaction';
import { EditorModeController } from './EditorModeController/EditorModeController';
import { RectModeController } from './EditorModeController/RectModeController';
import { SelectModeController } from './EditorModeController/SelectModeController';

/**
 * Root controller for Editor view
 */
export class EditorController {
    readonly store: Store<EditorState>;
    transaction: Transaction | null = null;
    private modeControllers: Record<EditorMode, EditorModeController>;

    constructor(initialData: Patch<EditorState>) {
        this.store = new Store(EditorState.create(initialData));
        this.modeControllers = {
            rect: new RectModeController(this),
            select: new SelectModeController(this),
        };
    }

    private _currentPoint = DisplayCordPoint({ x: 0, y: 0 });

    get currentPoint(): ModelCordPoint {
        return this.toModelPoint(this._currentPoint);
    }

    get modeController(): EditorModeController {
        return this.modeControllers[this.store.state.mode];
    }

    get camera(): Camera {
        return this.store.state.camera;
    }

    setMode(mode: EditorMode) {
        this.modeController.onBeforeDeactivate?.();
        this.store.setState({ mode });
        this.modeController.onAfterActivate?.();
    }

    // Transaction

    startTransaction(transaction: Transaction) {
        if (this.transaction !== null) {
            console.warn('Another transaction on going.');
            console.dir(this.transaction);
            return;
        }

        this.transaction = transaction;
        this.updateTransaction();
    }

    updateTransaction() {
        const transaction = this.transaction;
        if (transaction === null) {
            console.warn('No transaction on going.');
            return;
        }
        this.store.setState(transaction.update(this));
    }

    completeTransaction() {
        const transaction = this.transaction;
        if (transaction === null) {
            console.warn('No transaction on going.');
            return;
        }
        this.transaction = null;
    }

    // Event handlers

    onZoom = (diff: number) => {
        this.modeController.onZoom?.(diff);
    };

    onScroll = (dxInDisplay: number, dyInDisplay: number) => {
        const { scale } = this.store.state.camera;
        const dx = dxInDisplay / scale;
        const dy = dyInDisplay / scale;
        this.modeController.onScroll?.(dx, dy);
    };

    onMouseDown = (info: EventInfo) => this.modeController.onMouseDown?.(info);

    onMouseMove = (point: DisplayCordPoint) => {
        const prevPoint = this.currentPoint;
        const nextPoint = this.toModelPoint(point);
        this.modeController.onMouseMove?.(prevPoint, nextPoint);
        this._currentPoint = point;
    };

    onMouseUp = () => this.modeController.onMouseUp?.();

    onHover = (hover: HoverState) => {
        this.modeController.onHover?.(hover);
        this.store.setState({ hover });
    };

    onUnhover = () => {
        if (this.store.state.hover === null) return;

        this.modeController.onUnhover?.(this.store.state.hover);
        this.store.setState({ hover: null });
    };

    private toModelPoint(point: DisplayCordPoint): ModelCordPoint {
        return Point.toModel(this.camera, point);
    }

    private toDisplayPoint(point: ModelCordPoint): DisplayCordPoint {
        return Point.toDisplay(this.camera, point);
    }
}
