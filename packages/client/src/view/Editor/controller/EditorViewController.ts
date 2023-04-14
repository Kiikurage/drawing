import { Editor } from '../../../EditorCore/Editor';
import { ClipboardController } from './ClipboardController';
import { EditorViewEvents } from '../../../EditorCore/EditorViewEvents/EditorViewEvents';
import { ModeController } from '../../../EditorCore/mode/ModeController';
import { CameraController } from '../../../EditorCore/camera/CameraController';
import { PageController } from '../../../EditorCore/PageController/PageController';
import { TextEditController } from '../../../EditorCore/textEdit/TextEditController';
import { SelectionController } from '../../../EditorCore/selection/SelectionController';
import { TextController } from '../../../EditorCore/TextController/TextController';
import { LayoutController } from '../../../EditorCore/layout/LayoutController';
import { LineController } from '../../../EditorCore/LineController/LineController';
import { ContextMenuViewController } from './ContextMenuViewController';
import { MouseEventTarget } from '../../../EditorCore/model/MYMouseEvent';
import { ContextMenuController } from '../../../EditorCore/contextmenu/ContextMenuController';
import { KeyboardShortcutCommandManager } from '../../../EditorCore/CommandManager/KeyboardShortcutCommandManager';
import { TransformController } from '../../../EditorCore/TransformController/TransformController';
import { singleton } from '@drawing/common/src/lib/singleton';
import { Point } from '@drawing/common/src/model/Point';
import { Size } from '@drawing/common/src/model/Size';

export class EditorViewController {
    constructor(
        readonly editor: Editor,
        readonly cameraController: CameraController,
        readonly editorViewEvents: EditorViewEvents,
        readonly contextMenuController: ContextMenuController,
        readonly layoutController: LayoutController,
        readonly lineController: LineController,
        readonly modeController: ModeController,
        readonly pageController: PageController,
        readonly textController: TextController,
        readonly textEditController: TextEditController,
        readonly selectionController: SelectionController,
        readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager,
        readonly transformController: TransformController
    ) {
        const colorContextMenu = singleton(
            () => new ContextMenuViewController(contextMenuController, selectionController)
        );
        const clipboard = singleton(
            () => new ClipboardController(pageController, selectionController, keyboardShortcutCommandManager)
        );

        colorContextMenu();
        clipboard();
    }

    readonly handleWheel = (ev: WheelEvent) => {
        ev.preventDefault();

        if (ev.ctrlKey) {
            this.editorViewEvents.handleZoom({
                point: Point.toModel(this.cameraController.camera, Point.display(ev.clientX, ev.clientY)),
                diff: -0.001 * ev.deltaY,
            });
        } else if (ev.shiftKey) {
            // noinspection JSSuspiciousNameCombination
            this.editorViewEvents.handleScroll({
                diff: Size.toModel(this.cameraController.camera, Size.display(ev.deltaY, ev.deltaX)),
            });
        } else {
            this.editorViewEvents.handleScroll({
                diff: Size.toModel(this.cameraController.camera, Size.display(ev.deltaX, ev.deltaY)),
            });
        }
    };

    readonly handlePointerDown = (ev: PointerEvent, target: MouseEventTarget) => {
        const pointInDisplay = Point.display(ev.clientX, ev.clientY);
        this.editorViewEvents.handlePointerDown({
            target,
            pointerType: ev.pointerType,
            pointerId: ev.pointerId,
            button: ev.button,
            shiftKey: ev.shiftKey,
            pointInDisplay,
            point: Point.toModel(this.cameraController.camera, pointInDisplay),
        });
    };

    readonly handlePointerMove = (ev: PointerEvent, target: MouseEventTarget) => {
        const pointInDisplay = Point.display(ev.clientX, ev.clientY);
        this.editorViewEvents.handlePointerMove({
            target,
            pointerType: ev.pointerType,
            pointerId: ev.pointerId,
            button: ev.button,
            shiftKey: ev.shiftKey,
            pointInDisplay,
            point: Point.toModel(this.cameraController.camera, pointInDisplay),
        });
    };

    readonly handlePointerUp = (ev: PointerEvent, target: MouseEventTarget) => {
        const pointInDisplay = Point.display(ev.clientX, ev.clientY);
        this.editorViewEvents.handlePointerUp({
            target,
            pointerType: ev.pointerType,
            pointerId: ev.pointerId,
            button: ev.button,
            shiftKey: ev.shiftKey,
            pointInDisplay,
            point: Point.toModel(this.cameraController.camera, pointInDisplay),
        });
    };

    readonly handleDoubleClick = (ev: MouseEvent, target: MouseEventTarget) => {
        const pointInDisplay = Point.display(ev.clientX, ev.clientY);
        this.editorViewEvents.handleDoubleClick({
            target,
            button: ev.button,
            shiftKey: ev.shiftKey,
            pointInDisplay,
            point: Point.toModel(this.cameraController.camera, pointInDisplay),
        });
    };

    readonly handleKeyDown = (ev: KeyboardEvent) => {
        this.editorViewEvents.handleKeyDown({
            preventDefault: ev.preventDefault.bind(ev),
            shiftKey: ev.shiftKey,
            ctrlKey: ev.ctrlKey,
            key: ev.key,
        });
    };

    readonly handleKeyUp = (ev: KeyboardEvent) => {
        this.editorViewEvents.handleKeyUp({
            preventDefault: ev.preventDefault.bind(ev),
            shiftKey: ev.shiftKey,
            ctrlKey: ev.ctrlKey,
            key: ev.key,
        });
    };
}
