import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { Page, Point, Size } from '@drawing/common';
import { EditorController } from './core/controller/EditorController';
import { EditorControllerContextProvider } from './core/view/EditorControllerContext';
import { css } from '@linaria/core';
import { ContentLayer } from './core/view/ContentLayer';
import { ToolBar } from './core/view/ToolBar';
import { ContextMenuPopup } from './features/contextMenu/ContextMenuPopup';
import { extensions } from './extensions';
import { SelectionView } from './core/view/SelectionView/SelectionView';
import { SelectingRangeView } from './features/select/SelectingRangeView';
import { SnapGuide } from './features/snap/SnapGuide';

export const Editor = ({ defaultValue }: { defaultValue?: Page }) => {
    const [controller] = useState(() => {
        const controller = new EditorController({ page: defaultValue ?? Page.create() });
        extensions.forEach((extension) => controller.addExtension(extension));

        return controller;
    });

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onWheel = (ev: WheelEvent) => {
            ev.preventDefault();

            if (ev.ctrlKey) {
                controller.onZoom({
                    diff: -0.001 * ev.deltaY,
                    pointInDisplay: Point.display(ev.clientX, ev.clientY),
                });
            } else if (ev.shiftKey) {
                controller.onScroll(Size.display(ev.deltaY, ev.deltaX));
            } else {
                controller.onScroll(Size.display(ev.deltaX, ev.deltaY));
            }
        };

        const container = ref.current;
        if (container === null) return;

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, [controller]);

    useEffect(() => {
        const onMouseMove = (ev: MouseEvent) => {
            const pointInDisplay = Point.display(ev.clientX, ev.clientY);
            controller.onMouseMove({
                button: ev.button,
                shiftKey: ev.shiftKey,
                pointInDisplay,
            });
        };

        const onMouseUp = (ev: MouseEvent) => {
            const pointInDisplay = Point.display(ev.clientX, ev.clientY);
            controller.onMouseUp({
                button: ev.button,
                shiftKey: ev.shiftKey,
                pointInDisplay,
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('keydown', controller.onKeyDown);
        window.addEventListener('keyup', controller.onKeyUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('keydown', controller.onKeyDown);
            window.removeEventListener('keyup', controller.onKeyUp);
        };
    }, [controller]);

    const onMouseDown: MouseEventHandler = useCallback(
        (ev) => {
            controller.onMouseDown({
                button: ev.button,
                shiftKey: ev.shiftKey,
                pointInDisplay: Point.display(ev.clientX, ev.clientY),
            });
        },
        [controller]
    );

    return (
        <EditorControllerContextProvider value={controller}>
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
                onDoubleClick={(ev) =>
                    controller.onDoubleClick({
                        button: ev.button,
                        shiftKey: ev.shiftKey,
                        pointInDisplay: Point.display(ev.clientX, ev.clientY),
                    })
                }
            >
                <ContentLayer />
                <SelectionView />
                <SelectingRangeView />
                <SnapGuide />
                <ToolBar />
                <ContextMenuPopup />
            </div>
        </EditorControllerContextProvider>
    );
};
