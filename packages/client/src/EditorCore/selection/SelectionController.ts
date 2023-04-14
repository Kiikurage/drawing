import {
    Box,
    dispatcher,
    distinct,
    Entity,
    ModelCordBox,
    ModelCordPoint,
    Record,
    Store,
    TransformType,
} from '@drawing/common';
import { SelectionChangeEvent } from '../model/SelectionChangeEvent';
import { PageState } from '../PageController/PageState';
import { MYDragEvent } from '../model/MYDragEvent';
import { MouseEventButton } from '../model/MouseEventButton';
import { GestureRecognizer } from '../gesture/GestureRecognizer';
import { ModeController } from '../mode/ModeController';
import { SelectionState } from './SelectionState';
import { PageController } from '../PageController/PageController';
import { EditorViewEvents } from '../EditorViewEvents/EditorViewEvents';
import { MYPointerEvent } from '../model/MYPointerEvent';
import { Command } from '../CommandManager/Command';
import { KeyboardShortcutCommandManager } from '../CommandManager/KeyboardShortcutCommandManager';
import { RangeSelectionSession } from './RangeSelectionSession';
import { TransformController } from '../TransformController/TransformController';

export class SelectionController {
    static readonly ModeName = 'select';
    readonly store = new Store<SelectionState>(SelectionState.create());

    constructor(
        private readonly pageController: PageController,
        private readonly gestureRecognizer: GestureRecognizer,
        private readonly modeController: ModeController,
        private readonly editorViewEvents: EditorViewEvents,
        private readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager,
        private readonly transformController: TransformController
    ) {
        this.pageController.onChange.addListener(this.handleEditStateChange);
        this.gestureRecognizer.onDragStart.addListener(this.handleDragStart);

        this.editorViewEvents.onPointerDown.addListener(this.handlePointerDown);

        const selectAllCommand = Command('selectAll', 'Select all objects', () => this.selectAllEntities());
        this.keyboardShortcutCommandManager.set(['Control', 'A'], selectAllCommand);

        const changeModeCommand = Command('changeModeToSelect', 'Change mode to "Select"', () =>
            this.modeController.setMode(SelectionController.ModeName)
        );
        this.keyboardShortcutCommandManager.set(['V'], changeModeCommand);

        const deleteSelectedEntitiesCommand = Command('deleteSelectedEntities', 'Delete selected entities', () =>
            this.deleteSelectedEntities()
        );
        this.keyboardShortcutCommandManager
            .set(['Backspace'], deleteSelectedEntitiesCommand)
            .set(['Delete'], deleteSelectedEntitiesCommand);
    }

    readonly onChange = dispatcher<SelectionChangeEvent>();

    get selectedEntityIds() {
        return Object.keys(this.store.state.selected).filter((id) => this.store.state.selected[id]);
    }

    get selectedEntities(): Entity[] {
        return this.pageController.layout.filter((entity) => this.store.state.selected[entity.id]);
    }

    setSelection(entityIds: string[]) {
        const prevEntityIds = this.selectedEntityIds;
        const nextEntityIds = entityIds
            .filter((entityId) => this.pageController.page.entities[entityId] !== undefined)
            .reduce(distinct(), []);

        const patch: Record<string, boolean> = {};
        for (const id of prevEntityIds) patch[id] = false;
        for (const id of nextEntityIds) patch[id] = true;

        const onChangeDispatchFn = () => this.onChange.dispatch({ prevEntityIds, nextEntityIds });
        this.store.onChange.addListener(onChangeDispatchFn);
        this.store.setState({ selected: patch });
        this.store.onChange.removeListener(onChangeDispatchFn);
    }

    addSelection(entityId: string) {
        this.setSelection([...this.selectedEntityIds, entityId]);
    }

    removeSelection(entityId: string) {
        this.setSelection(this.selectedEntityIds.filter((id) => id !== entityId));
    }

    selectAllEntities() {
        this.setSelection(this.pageController.layout.map((entity) => entity.id));
    }

    unselectAllEntities() {
        this.setSelection([]);
    }

    startRangeSelection(point: ModelCordPoint) {
        this.store.setState({
            selectingRange: Box.fromPoints(point, point),
            selecting: true,
        });
    }

    updateRangeSelection(box: ModelCordBox) {
        this.store.setState({
            selectingRange: box,
            selecting: true,
        });
    }

    completeRangeSelection() {
        this.store.setState({ selecting: false });
    }

    deleteSelectedEntities() {
        this.pageController.deleteEntities(this.selectedEntityIds);
    }

    private readonly handlePointerDown = (ev: MYPointerEvent) => {
        if (this.modeController.mode === SelectionController.ModeName) {
            if (ev.button === MouseEventButton.PRIMARY) {
                if (ev.target.type === 'entity') {
                    if (ev.shiftKey) {
                        this.addSelection(ev.target.entityId);
                    } else {
                        this.setSelection([ev.target.entityId]);
                    }
                }
                if (ev.target.type === 'empty') {
                    if (!ev.shiftKey) {
                        this.unselectAllEntities();
                    }
                }
            }
        }
    };

    private readonly handleEditStateChange = (state: PageState) => {
        const newSelectedEntityIds = this.selectedEntityIds.filter((id) => state.page.entities[id] !== undefined);

        if (newSelectedEntityIds.length !== this.selectedEntityIds.length) {
            this.setSelection(newSelectedEntityIds);
        }
    };

    private readonly handleDragStart = (ev: MYDragEvent) => {
        if (this.modeController.mode === SelectionController.ModeName) {
            if (ev.button === MouseEventButton.PRIMARY) {
                if (ev.target.type === 'empty') {
                    new RangeSelectionSession(this.pageController, this, ev.session);
                }
                if (ev.target.type === 'entity') {
                    this.transformController.newSession({
                        entities: this.selectedEntities,
                        transformType: TransformType.TRANSLATE,
                        dragSession: ev.session,
                    });
                }
                if (ev.target.type === 'transformHandle') {
                    this.transformController.newSession({
                        entities: this.selectedEntities,
                        transformType: ev.target.transformType,
                        dragSession: ev.session,
                    });
                }
            }
        }
    };
}
