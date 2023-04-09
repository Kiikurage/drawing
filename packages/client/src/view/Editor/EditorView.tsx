import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { Page, Point, Size } from '@drawing/common';
import { Editor } from './core/controller/Editor';
import { EditorContextProvider } from './core/view/EditorControllerContext';
import { css } from '@linaria/core';
import { ContentLayer } from './core/view/ContentLayer';
import { Toolbar } from './core/extensions/toolbar/Toolbar';
import { ContextMenuPopup } from './core/extensions/contextMenu/ContextMenuPopup';
import { Extensions } from './extensions';
import { SelectionView } from './core/view/SelectionView/SelectionView';
import { SelectingRangeView } from './core/extensions/select/SelectingRangeView';
import { SnapGuide } from './extensions/snap/SnapGuide';

export const EditorView = ({ defaultValue }: { defaultValue?: Page }) => {
    const [editor] = useState(() => {
        const editor = new Editor({ page: defaultValue ?? Page.create() });
        Extensions.forEach((extension) => editor.addExtension(extension));

        return editor;
    });

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onWheel = (ev: WheelEvent) => {
            ev.preventDefault();

            if (ev.ctrlKey) {
                editor.handleZoom(Point.display(ev.clientX, ev.clientY), -0.001 * ev.deltaY);
            } else if (ev.shiftKey) {
                editor.handleScroll(Size.display(ev.deltaY, ev.deltaX));
            } else {
                editor.handleScroll(Size.display(ev.deltaX, ev.deltaY));
            }
        };

        const container = ref.current;
        if (container === null) return;

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, [editor]);

    useEffect(() => {
        const onMouseMove = (ev: MouseEvent) => {
            const pointInDisplay = Point.display(ev.clientX, ev.clientY);
            editor.handleMouseMove({
                button: ev.button,
                shiftKey: ev.shiftKey,
                pointInDisplay,
            });
        };

        const onMouseUp = (ev: MouseEvent) => {
            const pointInDisplay = Point.display(ev.clientX, ev.clientY);
            editor.handleMouseUp({
                button: ev.button,
                shiftKey: ev.shiftKey,
                pointInDisplay,
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('keydown', editor.handleKeyDown);
        window.addEventListener('keyup', editor.handleKeyUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('keydown', editor.handleKeyDown);
            window.removeEventListener('keyup', editor.handleKeyUp);
        };
    }, [editor]);

    const onMouseDown: MouseEventHandler = useCallback(
        (ev) => {
            editor.handleMouseDown({
                button: ev.button,
                shiftKey: ev.shiftKey,
                pointInDisplay: Point.display(ev.clientX, ev.clientY),
            });
        },
        [editor]
    );

    return (
        <EditorContextProvider value={editor}>
            <div
                ref={ref}
                className={css`
                    position: absolute;
                    inset: 0;
                    outline: none;

                    & > * {
                        pointer-events: none;
                        user-select: none;
                    }
                `}
                onMouseDown={onMouseDown}
                onContextMenu={(ev) => ev.preventDefault()}
                // onDoubleClick={(ev) =>
                //     editor.handleEntityDoubleClick({
                //         button: ev.button,
                //         shiftKey: ev.shiftKey,
                //         pointInDisplay: Point.display(ev.clientX, ev.clientY),
                //     })
                // }
            >
                <ContentLayer />
                <SelectionView />
                <SelectingRangeView />
                <SnapGuide />
                <Toolbar />
                <ContextMenuPopup />
            </div>
        </EditorContextProvider>
    );
};
