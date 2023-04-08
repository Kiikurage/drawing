import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { Page, Point, Size } from '@drawing/common';
import { EditorController } from './core/controller/EditorController';
import { EditorControllerContextProvider } from './core/view/EditorControllerContext';
import { css } from '@linaria/core';
import { ContentLayer } from './core/view/ContentLayer';
import { Toolbar } from './core/extensions/toolbar/Toolbar';
import { ContextMenuPopup } from './core/extensions/contextMenu/ContextMenuPopup';
import { Extensions } from './extensions';
import { SelectionView } from './core/view/SelectionView/SelectionView';
import { SelectingRangeView } from './core/extensions/select/SelectingRangeView';
import { SnapGuide } from './extensions/snap/SnapGuide';

export const Editor = ({ defaultValue }: { defaultValue?: Page }) => {
    const [controller] = useState(() => {
        const controller = new EditorController({ page: defaultValue ?? Page.create() });
        Extensions.forEach((extension) => controller.addExtension(extension));

        return controller;
    });

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onWheel = (ev: WheelEvent) => {
            ev.preventDefault();

            if (ev.ctrlKey) {
                controller.handleZoom(Point.display(ev.clientX, ev.clientY), -0.001 * ev.deltaY);
            } else if (ev.shiftKey) {
                controller.handleScroll(Size.display(ev.deltaY, ev.deltaX));
            } else {
                controller.handleScroll(Size.display(ev.deltaX, ev.deltaY));
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
            controller.handleMouseMove({
                button: ev.button,
                shiftKey: ev.shiftKey,
                pointInDisplay,
            });
        };

        const onMouseUp = (ev: MouseEvent) => {
            const pointInDisplay = Point.display(ev.clientX, ev.clientY);
            controller.handleMouseUp({
                button: ev.button,
                shiftKey: ev.shiftKey,
                pointInDisplay,
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('keydown', controller.handleKeyDown);
        window.addEventListener('keyup', controller.handleKeyUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('keydown', controller.handleKeyDown);
            window.removeEventListener('keyup', controller.handleKeyUp);
        };
    }, [controller]);

    const onMouseDown: MouseEventHandler = useCallback(
        (ev) => {
            controller.handleMouseDown({
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
                    controller.handleDoubleClick({
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
                <Toolbar />
                <ContextMenuPopup />
            </div>
        </EditorControllerContextProvider>
    );
};
