import { TransformType } from '../../model/TransformType';
import { EditorController, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';
import { TransformExtension } from './TransformExtension';

export class SelectModeExtension implements Extension {
    private controller: EditorController = null as never;

    constructor(private readonly transformExtension: TransformExtension) {}

    onActivate = (controller: EditorController) => {
        this.controller = controller;
        controller.onMouseDown.addListener(this.onMouseDown);
    };

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        if (this.controller.mode !== 'select') return;

        const { hover } = this.controller.state;

        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                switch (hover.type) {
                    case 'entity': {
                        if (ev.shiftKey) {
                            this.controller.addSelection(hover.entityId);
                        } else {
                            this.controller.setSelection([hover.entityId]);
                        }
                        this.transformExtension.startTransform(
                            ev.point,
                            this.controller.computeSelectedEntities(),
                            TransformType.TRANSLATE
                        );
                        return;
                    }

                    case 'transformHandle': {
                        this.transformExtension.startTransform(
                            ev.point,
                            this.controller.computeSelectedEntities(),
                            hover.transformType
                        );
                        return;
                    }
                }
                return;
            }
        }
    };
}
