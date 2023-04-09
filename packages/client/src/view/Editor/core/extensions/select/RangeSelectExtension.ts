import { Editor, MouseEventButton, MouseEventInfo } from '../../controller/Editor';
import { Extension } from '../../controller/Extension';
import { Box, Entity, ModelCordBox, ModelCordPoint, Store } from '@drawing/common';
import { RangeSelectState } from './RangeSelectState';
import { ModeExtension } from '../../../extensions/mode/ModeExtension';
import { ModeChangeEvent } from '../../../extensions/mode/ModeChangeEvent';
import { SelectExtension } from './SelectExtension';

export class RangeSelectExtension extends Extension {
    private startPoint: ModelCordPoint | null = null;
    private preSelectedEntityIds: string[] = [];
    private selectExtension: SelectExtension = null as never;
    readonly store = new Store(RangeSelectState.create());

    initialize(controller: Editor) {
        super.initialize(controller);

        this.selectExtension = controller.requireExtension(SelectExtension);

        const modeExtension = controller.requireExtension(ModeExtension);
        modeExtension.onModeChange.addListener(this.handleModeChange);
        this.updateModeSpecificListener(modeExtension.mode);
    }

    setSelectingRange(range: ModelCordBox) {
        return this.store.setState({
            selecting: true,
            range,
        });
    }

    clearSelectingRange() {
        return this.store.setState({
            selecting: false,
        });
    }

    private readonly handleModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
    };

    private updateModeSpecificListener(mode: string) {
        if (mode === SelectExtension.MODE_KEY) {
            this.controller.onMouseDown.addListener(this.handleMouseDown);
            this.controller.onMouseMove.addListener(this.handleMouseMove);
            this.controller.onMouseUp.addListener(this.handleMouseUp);
        } else {
            this.controller.onMouseDown.removeListener(this.handleMouseDown);
            this.controller.onMouseMove.removeListener(this.handleMouseMove);
            this.controller.onMouseUp.removeListener(this.handleMouseUp);
        }
    }

    private readonly handleMouseDown = (ev: MouseEventInfo) => {
        if (ev.button === MouseEventButton.PRIMARY) {
            if (this.controller.state.hover.type === 'idle') {
                if (!ev.shiftKey) this.selectExtension.clearSelection();

                this.preSelectedEntityIds = this.selectExtension.selectedEntityIds;
                this.startPoint = ev.point;
            }
        }
    };

    private readonly handleMouseMove = (ev: MouseEventInfo) => {
        if (this.startPoint === null) return;

        const width = ev.point.x - this.startPoint.x;
        const height = ev.point.y - this.startPoint.y;

        const range = Box.model(
            Math.min(this.startPoint.x, this.startPoint.x + width),
            Math.min(this.startPoint.y, this.startPoint.y + height),
            Math.abs(width),
            Math.abs(height)
        );

        this.setRange(range);
    };

    private readonly handleMouseUp = () => {
        this.clearSelectingRange();
        this.startPoint = null;
    };

    private setRange(range: ModelCordBox) {
        const overlappedEntityIds = Object.values(this.controller.state.page.entities)
            .filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), range))
            .map((entity) => entity.id);

        this.setSelectingRange(range);
        this.selectExtension.setSelection([...this.preSelectedEntityIds, ...overlappedEntityIds]);
    }
}