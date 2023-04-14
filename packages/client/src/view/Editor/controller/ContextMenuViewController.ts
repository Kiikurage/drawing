import { ContextMenuController } from '../../../EditorCore/contextmenu/ContextMenuController';
import { ColorContextMenuSection } from '../view/ContextMenu/ColorContextMenuSection';
import { TextAlignmentContextMenuSection } from '../view/ContextMenu/TextAlignmentContextMenuSection';
import { SelectionController } from '../../../EditorCore/selection/SelectionController';
import { LayoutContextMenuSection } from '../view/ContextMenu/LayoutContextMenuSection';
import { ArrowHeadContextMenuSection } from '../view/ContextMenu/ArrowHeadContextMenuSection';
import { OrderContextMenuSection } from '../view/ContextMenu/OrderContextMenuSection';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';

export class ContextMenuViewController {
    constructor(
        private readonly contextMenuController: ContextMenuController,
        private readonly selectionController: SelectionController
    ) {
        this.contextMenuController.addSection({
            view: ColorContextMenuSection,
            activateIf: () => {
                return true;
            },
        });
        this.contextMenuController.addSection({
            view: TextAlignmentContextMenuSection,
            activateIf: () => {
                const selectedEntities = selectionController.selectedEntities;

                return selectedEntities.length > 0 && selectedEntities.every((entity) => Entity.isTextEditable(entity));
            },
        });
        this.contextMenuController.addSection({
            view: ArrowHeadContextMenuSection,
            activateIf: () => {
                const selectedEntities = selectionController.selectedEntities;

                return selectedEntities.length > 0 && selectedEntities.every((entity) => entity.type === 'line');
            },
        });
        this.contextMenuController.addSection({
            view: LayoutContextMenuSection,
            activateIf: () => {
                return selectionController.selectedEntities.length >= 2;
            },
        });
        this.contextMenuController.addSection({
            view: OrderContextMenuSection,
            activateIf: () => {
                return selectionController.selectedEntityIds.length === 1;
            },
        });
        // this.contextMenuController.addSection({
        //     view: GroupContextMenuSection,
        //     activateIf: () => {
        //         return selectionController.selectedEntities.length >= 2;
        //     },
        // });
    }
}
