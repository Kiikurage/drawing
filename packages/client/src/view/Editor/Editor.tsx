import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { Page, Point, Size } from '@drawing/common';
import { EditorController } from './controller/EditorController';
import { deps } from '../../config/dependency';
import { EditorControllerContextProvider } from './EditorControllerContext';
import { css } from '@linaria/core';
import { ContentLayer } from './view/ContentLayer';
import { IndicatorLayer } from './view/IndicatorLayer';
import { ToolBar } from './view/ToolBar';
import { ContextMenuPopup } from './view/ContextMenuPopup';

export const Editor = ({ defaultValue }: { defaultValue?: Page }) => {
    const [controller] = useState(() =>
        new EditorController({ page: defaultValue ?? Page.create() })
            .addExtension(deps.cameraExtension())
            .addExtension(deps.contextMenuExtension())
            .addExtension(deps.lineModeExtension())
            .addExtension(deps.rangeSelectExtension())
            .addExtension(deps.rectModeExtension())
            .addExtension(deps.selectModeExtension())
            .addExtension(deps.textEditModeExtension())
            .addExtension(deps.textModeExtension())
            .addExtension(deps.transformExtension())
    );

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
                <IndicatorLayer />
                <ToolBar />
                <ContextMenuPopup />
            </div>
        </EditorControllerContextProvider>
    );
};
