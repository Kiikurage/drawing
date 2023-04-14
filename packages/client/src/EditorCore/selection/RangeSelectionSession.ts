import { SelectionController } from './SelectionController';
import { DragSession } from '../gesture/DragSession';
import { PageController } from '../PageController/PageController';
import { Box } from '@drawing/common/src/model/Box';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';

export class RangeSelectionSession {
    private readonly preSelectedEntityIds: string[];

    constructor(
        private readonly pageController: PageController,
        private readonly selectionController: SelectionController,
        private readonly dragSession: DragSession
    ) {
        this.preSelectedEntityIds = selectionController.selectedEntityIds;
        dragSession.onUpdate.addListener(this.handleDragUpdate);
        dragSession.onEnd.addListener(this.handleDragEnd);

        this.selectionController.startRangeSelection(dragSession.startPoint);
    }

    private readonly handleDragUpdate = () => {
        const selectingRange = Box.fromPoints(this.dragSession.startPoint, this.dragSession.currentPoint);
        const entityIds = this.pageController.layout
            .filter((entity) => Box.isOverlap(selectingRange, Entity.getBoundingBox(entity)))
            .map((entity) => entity.id);

        this.selectionController.updateRangeSelection(selectingRange);
        this.selectionController.setSelection([...entityIds, ...this.preSelectedEntityIds]);
    };

    private readonly handleDragEnd = () => {
        this.selectionController.completeRangeSelection();
    };
}
