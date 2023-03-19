import { css } from '@emotion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Store } from '../../lib/Store';
import { Page } from '../../model/Page';
import { useStore } from '../hooks/useStore';
import { RectModeEditorController } from './controller/RectModeEditorController';
import { SelectModeEditorController } from './controller/SelectModeEditorController';
import { EditorControllerContextProvider } from './EditorControllerContext';
import { EditorMode } from './model/EditorMode';
import { EditorState } from './model/EditorState';
import { EditorToolBar } from './view/EditorToolBar';
import { IndicatorLayer } from './view/IndicatorLayer';
import { PageView } from './view/PageView';

export const Editor = ({ defaultValue = Page.create() }: { defaultValue?: Page }) => {
    const [store] = useState(() => new Store<EditorState>(EditorState.create({ page: defaultValue })));

    const { page, camera, mode, selectedEntities, hoveredEntity } = useStore(store);

    const controller = useMemo(() => {
        switch (mode) {
            case 'select':
                return new SelectModeEditorController(store);
            case 'rect':
                return new RectModeEditorController(store);
        }
    }, [mode, store]);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onWheel = (ev: WheelEvent) => {
            ev.preventDefault();

            if (ev.ctrlKey) {
                controller.onZoom(ev.clientX, ev.clientY, -0.005 * ev.deltaY);
            } else if (ev.shiftKey) {
                controller.onScroll(-0.5 * ev.deltaY, 0.5 * ev.deltaX);
            } else {
                controller.onScroll(0.5 * ev.deltaX, 0.5 * ev.deltaY);
            }
        };

        const container = ref.current;
        if (container === null) return;

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, [controller]);

    const onModeChange = useCallback((mode: EditorMode) => controller.setMode(mode), [controller]);

    return (
        <EditorControllerContextProvider value={controller}>
            <div
                ref={ref}
                css={css`
                    position: absolute;
                    inset: 0;
                `}
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
