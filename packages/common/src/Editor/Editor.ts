import { PageController } from './PageController/PageController';
import { CameraController } from '@drawing/common/src/Editor/CameraController/CameraController';
import { ContextMenuController } from '@drawing/common/src/Editor/ContextMenuController/ContextMenuController';
import { TextController } from './TextController/TextController';
import { LineController } from './LineController/LineController';
import { SelectionController } from './selection/SelectionController';
import { TextEditController } from './textEdit/TextEditController';
import { ModeController } from './mode/ModeController';
import { EditorViewEvents } from './EditorViewEvents/EditorViewEvents';
import { KeyboardShortcutCommandManager } from './CommandManager/KeyboardShortcutCommandManager';
import { TransformController } from './TransformController/TransformController';

export class Editor {
    constructor(
        readonly modeController: ModeController,
        readonly pageController: PageController,
        readonly cameraController: CameraController,
        readonly contextMenuController: ContextMenuController,
        readonly textController: TextController,
        readonly textEditController: TextEditController,
        readonly lineController: LineController,
        readonly selectionController: SelectionController,
        readonly editorViewEvents: EditorViewEvents,
        readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager,
        readonly transformController: TransformController
    ) {}
}
