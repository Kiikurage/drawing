import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { Page } from '../../model/Page';
import { Point } from '../../model/Point';
import { Size } from '../../model/Size';
import { EditorController } from './controller/EditorController';
import { EditorControllerContextProvider } from './EditorControllerContext';
import { ContentLayer } from './view/ContentLayer';
import { ContextMenuPopup } from './view/ContextMenuPopup';
import { IndicatorLayer } from './view/IndicatorLayer';
import { ToolBar } from './view/ToolBar';

export const Editor = ({ defaultValue }: { defaultValue?: Page }) => {
    const [controller] = useState(() => new EditorController({ page: defaultValue ?? Page.create() }));

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onWheel = (ev: WheelEvent) => {
            ev.preventDefault();

            if (ev.ctrlKey) {
                controller.onZoom(-0.005 * ev.deltaY);
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

    return (
        <EditorControllerContextProvider value={controller}>
            <div
                ref={ref}
                css={css`
                    position: absolute;
                    inset: 0;
                    outline: none;

                    & > * {
                        pointer-events: none;
                    }
                `}
                tabIndex={-1}
                onMouseDown={controller.onMouseDown}
                onMouseMove={(ev) => controller.onMouseMove(Point.display(ev.clientX, ev.clientY))}
                onMouseUp={controller.onMouseUp}
                onKeyDown={controller.onKeyDown}
                onKeyUp={controller.onKeyUp}
                onContextMenu={(ev) => ev.preventDefault()}
                onDoubleClick={controller.onDoubleClick}
            >
                <ContentLayer />
                <IndicatorLayer />
                <ToolBar />
                <ContextMenuPopup />
            </div>
        </EditorControllerContextProvider>
    );
};
