import { css } from '@emotion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Page } from '../../model/Page';
import { Point } from '../../model/Point';
import { Size } from '../../model/Size';
import { useStore } from '../hooks/useStore';
import { EditorController } from './controller/EditorController';
import { EditorControllerContextProvider } from './EditorControllerContext';
import { EditorMode } from './model/EditorMode';
import { IndicatorLayer } from './view/IndicatorLayer';
import { PageView } from './view/PageView';
import { ToolBar } from './view/ToolBar';

export const Editor = ({ defaultValue = Page.create() }: { defaultValue?: Page }) => {
    const [controller] = useState(() => new EditorController({ page: defaultValue }));
    const { page, camera, mode, hover, selectingRange, contextMenu } = useStore(controller.store);

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

    useEffect(() => {
        const onMouseMove = (ev: MouseEvent) => {
            controller.onMouseMove(Point.display(ev.clientX, ev.clientY));
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', controller.onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', controller.onMouseUp);
        };
    }, [controller]);

    const onModeChange = useCallback((mode: EditorMode) => controller.setMode(mode), [controller]);

    const selectedEntities = controller.computeSelectedEntities();

    const hoveredEntity = useMemo(() => {
        if (hover?.type !== 'entity') return null;

        return page.entities[hover.entityId] ?? null;
    }, [hover, page.entities]);

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
                onKeyDown={controller.onKeyDown}
                onKeyUp={controller.onKeyUp}
                onContextMenu={(ev) => ev.preventDefault()}
            >
                <PageView page={page} camera={camera} />
                <IndicatorLayer
                    camera={camera}
                    selectedEntities={selectedEntities}
                    hoveredEntity={hoveredEntity}
                    contextMenu={contextMenu}
                    selectingRange={selectingRange}
                />
                <div
                    css={css`
                        position: absolute;
                        bottom: 32px;
                        display: flex;
                        justify-content: center;
                        width: 100%;
                    `}
                >
                    <ToolBar mode={mode} onChange={onModeChange} />
                </div>
            </div>
        </EditorControllerContextProvider>
    );
};
