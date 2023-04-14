import { useEffect, useRef, useState } from 'react';
import { Editor } from '../../EditorCore/Editor';
import { EditorContextProvider } from './view/EditorControllerContext';
import { css } from '@linaria/core';
import { ContentLayer } from './view/ContentLayer/ContentLayer';
import { Toolbar } from './view/ToolBar/Toolbar';
import { ContextMenuPopup } from './view/ContextMenu/ContextMenuPopup';
import { SelectionView } from './view/SelectionView/SelectionView';
import { SelectingRangeView } from './view/SelectionView/SelectingRangeView';
import { SnapGuide } from './view/SnapGuide';
import { EditorViewController } from './controller/EditorViewController';
import { OutlineLayer } from './view/OutlineLayer/OutlineLayer';
import { CameraLayer } from './view/CameraLayer/CameraLayer';

export const EditorView = ({ editor }: { editor: Editor }) => {
    const [controller] = useState(
        () =>
            new EditorViewController(
                editor,
                editor.cameraController,
                editor.editorViewEvents,
                editor.contextMenuController,
                editor.layoutController,
                editor.lineController,
                editor.modeController,
                editor.pageController,
                editor.textController,
                editor.textEditController,
                editor.selectionController,
                editor.keyboardShortcutCommandManager,
                editor.transformController
            )
    );

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = ref.current;
        if (container === null) return;

        container.addEventListener('wheel', controller.handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', controller.handleWheel);
        };
    }, [controller]);

    useEffect(() => {
        const handlePointerMove = (ev: PointerEvent) => {
            controller.handlePointerMove(ev, { type: 'empty' });
            ev.stopPropagation();
        };
        const handlePointerUp = (ev: PointerEvent) => {
            controller.handlePointerUp(ev, { type: 'empty' });
            ev.stopPropagation();
        };
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('keydown', controller.handleKeyDown);
        window.addEventListener('keyup', controller.handleKeyUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('keydown', controller.handleKeyDown);
            window.removeEventListener('keyup', controller.handleKeyUp);
        };
    }, [controller]);

    return (
        <EditorContextProvider value={controller}>
            <div
                ref={ref}
                className={css`
                    position: absolute;
                    inset: 0;
                    outline: none;
                    touch-action: none;
                    background: #f9fafb;

                    & > * {
                        pointer-events: none;
                        user-select: none;
                    }
                `}
                onPointerDown={(ev) => controller.handlePointerDown(ev.nativeEvent, { type: 'empty' })}
                onContextMenu={(ev) => ev.preventDefault()}
                onDoubleClick={(ev) => controller.handleDoubleClick(ev.nativeEvent, { type: 'empty' })}
            >
                <CameraLayer>
                    <ContentLayer />
                    <OutlineLayer />
                    <SnapGuide />
                    <SelectionView />
                    <SelectingRangeView />
                </CameraLayer>
                <Toolbar />
                <ContextMenuPopup />
            </div>
        </EditorContextProvider>
    );
};
