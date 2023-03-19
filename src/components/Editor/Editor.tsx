import { css } from '@emotion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Page } from '../../model/Page';
import { Point } from '../../model/Point';
import { Size } from '../../model/Size';
import { useStore } from '../hooks/useStore';
import { EditorController } from './controllers/EditorController';
import { EditorControllerContextProvider } from './EditorControllerContext';
import { EditorMode } from './model/EditorMode';
import { EditorToolBar } from './view/EditorToolBar';
import { IndicatorLayer } from './view/IndicatorLayer';
import { PageView } from './view/PageView';

export const Editor = ({ defaultValue = Page.create() }: { defaultValue?: Page }) => {
    const [controller] = useState(() => new EditorController({ page: defaultValue }));
    const { page, camera, mode, selectedEntityIds, hover } = useStore(controller.store);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onWheel = (ev: WheelEvent) => {
            ev.preventDefault();

            if (ev.ctrlKey) {
                controller.onZoom(-0.005 * ev.deltaY);
            } else if (ev.shiftKey) {
                controller.onScroll(Size.display({ width: ev.deltaY, height: ev.deltaX }));
            } else {
                controller.onScroll(Size.display({ width: ev.deltaX, height: ev.deltaY }));
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
            controller.onMouseMove(Point.display({ x: ev.clientX, y: ev.clientY }));
        };

        const onMouseUp = () => controller.onMouseUp();

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [controller]);

    const onModeChange = useCallback((mode: EditorMode) => controller.setMode(mode), [controller]);

    const selectedEntities = useMemo(() => {
        return page.entities.filter((entity) => selectedEntityIds.includes(entity.id));
    }, [page.entities, selectedEntityIds]);

    const hoveredEntity = useMemo(() => {
        if (hover?.type !== 'entity') return null;

        return page.entities.find((entity) => entity.id === hover.entityId) ?? null;
    }, [hover, page.entities]);

    return (
        <EditorControllerContextProvider value={controller}>
            <div
                ref={ref}
                css={css`
                    position: absolute;
                    inset: 0;

                    & > * {
                        pointer-events: none;
                    }
                `}
                tabIndex={-1}
                onMouseDown={controller.onMouseDown}
                onKeyDown={controller.onKeyDown}
            >
                <PageView page={page} camera={camera} />
                <IndicatorLayer camera={camera} selectedEntities={selectedEntities} hoveredEntity={hoveredEntity} />
                <div
                    css={css`
                        position: absolute;
                        bottom: 32px;
                        display: flex;
                        justify-content: center;
                        width: 100%;
                    `}
                >
                    <EditorToolBar mode={mode} onChange={onModeChange} />
                </div>
            </div>
        </EditorControllerContextProvider>
    );
};
