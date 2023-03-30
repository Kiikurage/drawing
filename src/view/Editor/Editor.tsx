import { css } from '@linaria/core';
import { useEffect, useRef, useState } from 'react';
import { Page } from '../../model/Page';
import { Point } from '../../model/Point';
import { Size } from '../../model/Size';
import { CameraExtension } from './controller/CameraExtension';
import { EditorController } from './controller/EditorController';
import { EditorControllerContextProvider } from './EditorControllerContext';
import { ContentLayer } from './view/ContentLayer';
import { ContextMenuPopup } from './view/ContextMenuPopup';
import { IndicatorLayer } from './view/IndicatorLayer';
import { ToolBar } from './view/ToolBar';

export const Editor = ({ defaultValue }: { defaultValue?: Page }) => {
    const [controller] = useState(() =>
        new EditorController({ page: defaultValue ?? Page.create() }).addExtension(new CameraExtension())
    );

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onWheel = (ev: WheelEvent) => {
            ev.preventDefault();

            if (ev.ctrlKey) {
                controller.onZoom(-0.001 * ev.deltaY);
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
        const onMouseMove = (ev: MouseEvent) => controller.onMouseMove(Point.display(ev.clientX, ev.clientY));

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', controller.onMouseUp);
        window.addEventListener('keydown', controller.onKeyDown);
        window.addEventListener('keyup', controller.onKeyUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', controller.onMouseUp);
            window.removeEventListener('keydown', controller.onKeyDown);
            window.removeEventListener('keyup', controller.onKeyUp);
        };
    }, [controller]);

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
                onMouseDown={controller.onMouseDown}
                onClick={controller.onClick}
                onContextMenu={(ev) => ev.preventDefault()}
                onDoubleClick={(ev) => controller.onDoubleClick(Point.display(ev.clientX, ev.clientY))}
            >
                <ContentLayer />
                <IndicatorLayer />
                <ToolBar />
                <ContextMenuPopup />
            </div>
        </EditorControllerContextProvider>
    );
};
