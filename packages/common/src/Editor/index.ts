import { ModeController } from './mode/ModeController';
import { PageController } from './PageController/PageController';
import { GestureRecognizer } from '@drawing/common/src/Editor/GestureRecognizer/GestureRecognizer';
import { CameraController } from '@drawing/common/src/Editor/CameraController/CameraController';
import { KeyPatternRecognizer } from './CommandManager/KeyPatternRecognizer';
import { ContextMenuController } from '@drawing/common/src/Editor/ContextMenuController/ContextMenuController';
import { TextController } from './TextController/TextController';
import { TextEditController } from './textEdit/TextEditController';
import { LineController } from './LineController/LineController';
import { PolygonController } from './PolygonController/PolygonController';
import { SelectionController } from './selection/SelectionController';
import { EditorViewEvents } from './EditorViewEvents/EditorViewEvents';
import { DependencyContainer } from '../lib/DependencyContainer';
import { Editor } from './Editor';
import { CommandManager } from './CommandManager/CommandManager';
import { KeyboardShortcutCommandManager } from './CommandManager/KeyboardShortcutCommandManager';
import { TransformController } from './TransformController/TransformController';

export function createEditor(): Editor {
    const $ = new DependencyContainer();

    return $.lazy(ModeController, () => {
        return new ModeController();
    })
        .lazy(PageController, () => {
            return new PageController($.get(KeyboardShortcutCommandManager));
        })
        .lazy(GestureRecognizer, () => {
            return new GestureRecognizer($.get(EditorViewEvents));
        })
        .lazy(CameraController, () => {
            return new CameraController($.get(EditorViewEvents), $.get(GestureRecognizer));
        })
        .lazy(KeyPatternRecognizer, () => {
            return new KeyPatternRecognizer($.get(EditorViewEvents));
        })
        .lazy(ContextMenuController, () => {
            return new ContextMenuController(
                $.get(GestureRecognizer),
                $.get(EditorViewEvents),
                $.get(ModeController),
                $.get(SelectionController)
            );
        })
        .lazy(TextEditController, () => {
            return new TextEditController(
                $.get(SelectionController),
                $.get(EditorViewEvents),
                $.get(PageController),
                $.get(KeyboardShortcutCommandManager)
            );
        })
        .lazy(EditorViewEvents, () => {
            return new EditorViewEvents();
        })
        .lazy(CommandManager, () => {
            return new CommandManager();
        })
        .lazy(KeyboardShortcutCommandManager, () => {
            return new KeyboardShortcutCommandManager($.get(CommandManager), $.get(KeyPatternRecognizer));
        })
        .lazy(TransformController, () => {
            return new TransformController($.get(PageController), $.get(CameraController), $.get(EditorViewEvents));
        })
        .service(SelectionController, () => {
            return new SelectionController(
                $.get(PageController),
                $.get(GestureRecognizer),
                $.get(ModeController),
                $.get(EditorViewEvents),
                $.get(KeyboardShortcutCommandManager),
                $.get(TransformController)
            );
        })
        .service(PolygonController, () => {
            return new PolygonController(
                $.get(GestureRecognizer),
                $.get(ModeController),
                $.get(PageController),
                $.get(SelectionController),
                $.get(KeyboardShortcutCommandManager),
                $.get(TransformController)
            );
        })
        .service(LineController, () => {
            return new LineController(
                $.get(GestureRecognizer),
                $.get(ModeController),
                $.get(PageController),
                $.get(SelectionController),
                $.get(KeyboardShortcutCommandManager),
                $.get(TransformController)
            );
        })
        .service(TextController, () => {
            return new TextController(
                $.get(GestureRecognizer),
                $.get(ModeController),
                $.get(SelectionController),
                $.get(PageController),
                $.get(TextEditController),
                $.get(KeyboardShortcutCommandManager),
                $.get(TransformController)
            );
        })
        .service(Editor, () => {
            return new Editor(
                $.get(ModeController),
                $.get(PageController),
                $.get(CameraController),
                $.get(ContextMenuController),
                $.get(TextController),
                $.get(TextEditController),
                $.get(LineController),
                $.get(SelectionController),
                $.get(EditorViewEvents),
                $.get(KeyboardShortcutCommandManager),
                $.get(TransformController)
            );
        })
        .get(Editor);
}
