import { IEditorController, MouseEventInfo } from '../../core/controller/IEditorController';
import { Extension } from '../../core/controller/Extension';
import { HorizontalAlign, Record, TextEntity, TransformType, VerticalAlign } from '@drawing/common';
import { TextEditExtension } from '../../core/extensions/textEdit/TextEditExtension';
import { TransformExtension } from '../transform/TransformExtension';
import { ContextMenuExtension } from '../../core/extensions/contextMenu/ContextMenuExtension';
import { TextAlignmentContextMenuSection } from './TextAlignmentContextMenuSection';
import { ModeExtension } from '../mode/ModeExtension';
import { ModeChangeEvent } from '../mode/ModeChangeEvent';
import { SelectExtension } from '../../core/extensions/select/SelectExtension';
import { ToolbarExtension } from '../../core/extensions/toolbar/ToolbarExtension';
import { TextModeToolbarButton } from './TextModeToolbarButton';

export class TextExtension extends Extension {
    static readonly MODE_KEY = 'text';
    private transformExtension: TransformExtension = null as never;
    private textEditExtension: TextEditExtension = null as never;
    private selectExtension: SelectExtension = null as never;
    private modeExtension: ModeExtension = null as never;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);

        controller.requireExtension(ToolbarExtension).addItem({ view: TextModeToolbarButton });

        this.transformExtension = controller.requireExtension(TransformExtension);
        this.textEditExtension = controller.requireExtension(TextEditExtension);
        this.selectExtension = controller.requireExtension(SelectExtension);
        this.modeExtension = controller.requireExtension(ModeExtension);

        const modeExtension = controller.requireExtension(ModeExtension);
        modeExtension.onModeChange.addListener(this.onModeChange);
        this.updateModeSpecificListener(modeExtension.mode);

        controller.shortcuts.addPatternListener(['T'], () => {
            modeExtension.setMode(TextExtension.MODE_KEY);
        });

        controller.requireExtension(ContextMenuExtension).addSection({
            view: TextAlignmentContextMenuSection,
            activateIf: () =>
                this.selectExtension.selectedEntities.every(
                    (entity) => entity.type === 'text' || entity.type === 'rect'
                ),
        });
    }

    setVerticalTextAlignForSelectedEntities(align: VerticalAlign) {
        this.setVerticalTextAlign(this.selectExtension.selectedEntityIds, align);
    }

    setVerticalTextAlign(entityIds: string[], align: VerticalAlign) {
        this.controller.updateEntities(
            'verticalTextAlign',
            Record.mapToRecord(entityIds, (entityId) => [
                entityId,
                {
                    verticalAlign: align,
                },
            ])
        );
    }

    setHorizontalTextAlignForSelectedEntities(align: HorizontalAlign) {
        this.setHorizontalTextAlign(this.selectExtension.selectedEntityIds, align);
    }

    setHorizontalTextAlign(entityIds: string[], align: HorizontalAlign) {
        this.controller.updateEntities(
            'horizontalTextAlign',
            Record.mapToRecord(entityIds, (entityId) => [
                entityId,
                {
                    horizontalAlign: align,
                },
            ])
        );
    }

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
    };

    private updateModeSpecificListener(mode: string) {
        if (mode === TextExtension.MODE_KEY) {
            this.controller.onMouseDown.addListener(this.onMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        const newEntity = TextEntity.create({ p1: ev.point });
        const newEntityMap = { [newEntity.id]: newEntity };

        const session = this.controller.newSession();
        session.addEntities(newEntityMap);
        this.selectExtension.addSelection(newEntity.id);

        this.transformExtension.startTransform(ev.point, newEntityMap, TransformType.RESIZE_BOTTOM_RIGHT, {
            session,
            autoCommit: false,
        });
        this.transformExtension.onTransformEnd.addListenerOnce(() => {
            this.modeExtension.setMode(SelectExtension.MODE_KEY);
            this.textEditExtension.startTextEdit(newEntity.id, { session });
        });
    };
}
