import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef } from 'react';
import { Store } from '../../lib/Store';
import { Camera } from '../../model/Camera';
import { Page } from '../../model/Page';
import { useStore } from '../hooks/useStore';
import { Preview } from '../Preview';
import { EditorState } from './EditorState';
import { RectModeEditorController } from './RectModeEditorController';
import { SelectModeEditorController } from './SelectModeEditorController';

export const Editor = ({ defaultValue }: { defaultValue: Page }) => {
    const store = useMemo(
        () =>
            new Store<EditorState>({
                page: defaultValue,
                mode: 'select',
                camera: Camera.create(),
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const { page, camera, mode } = useStore(store);

    const ref = useRef<HTMLDivElement>(null);

    const controller = useMemo(() => {
        switch (mode) {
            case 'select':
                return new SelectModeEditorController(store);
            case 'rect':
                return new RectModeEditorController(store);
        }
    }, [mode, store]);

    const onMouseDown: MouseEventHandler = useCallback(
        (ev) => {
            const x = ev.clientX / camera.scale + camera.x;
            const y = ev.clientY / camera.scale + camera.y;
            controller.onMouseDown(x, y);
        },
        [camera.scale, camera.x, camera.y, controller]
    );

    useEffect(() => {
        const onWheel = (ev: WheelEvent) => {
            ev.preventDefault();
            if (ev.ctrlKey) {
                const fx = ev.clientX / camera.scale + camera.x;
                const fy = ev.clientY / camera.scale + camera.y;
                controller.onZoom(fx, fy, 0.001 * ev.deltaY);
            } else if (ev.shiftKey) {
                controller.onScroll(ev.deltaY, ev.deltaX);
            } else {
                controller.onScroll(ev.deltaX, ev.deltaY);
            }
        };

        const container = ref.current;
        if (container === null) return;

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, [camera.scale, camera.x, camera.y, controller, store]);

    return (
        <div
            ref={ref}
            css={css`
                position: absolute;
                inset: 0;
                background: #f3f6fc;
            `}
            onMouseDown={onMouseDown}
        >
            <Preview page={page} camera={camera} />
            <div
                css={css`
                    position: absolute;
                    bottom: 32px;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                `}
            >
                <div
                    css={css`
                        display: flex;
                        justify-content: center;
                        gap: 8px;
                        background: #fff;
                        border-radius: 8px;
                        padding: 8px 16px;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                    `}
                >
                    <ModeButton aria-pressed={mode === 'select'} onClick={() => store.setState({ mode: 'select' })}>
                        選択
                    </ModeButton>
                    <ModeButton aria-pressed={mode === 'rect'} onClick={() => store.setState({ mode: 'rect' })}>
                        長方形
                    </ModeButton>
                </div>
            </div>
        </div>
    );
};

const ModeButton = styled.button`
    width: 64px;
    height: 64px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #f0f0f0;
    border: none;
    cursor: pointer;

    &:hover {
        background: #e8e8e8;
    }

    &[aria-pressed='true'] {
        color: #fff;
        background: #666;
    }
`;
