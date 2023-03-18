import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useMemo, useRef } from 'react';
import { Store } from '../../lib/Store';
import { Page } from '../../model/Page';
import { useStore } from '../hooks/useStore';
import { Preview } from '../Preview';
import { EditorController } from './EditorController';
import { EditorState } from './EditorState';
import { SelectModeEditorController } from './SelectModeEditorController';

const samplePage: Page = {
    entities: [
        {
            type: 'rect',
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            strokeColor: '#000',
            fillColor: '#ff0',
        },
        {
            type: 'text',
            x: 300,
            y: 100,
            value: 'Hello World!',
        },
    ],
};
export const Editor = ({ store }: { store: Store<EditorState> }) => {
    const { camera, mode } = useStore(store);

    const ref = useRef<HTMLDivElement>(null);

    const controller = useMemo(() => {
        switch (mode) {
            case 'select':
                return new SelectModeEditorController(store);
            default:
                return new EditorController(store);
        }
    }, [mode, store]);

    useEffect(() => {
        const handleWheel = (ev: WheelEvent) => {
            ev.preventDefault();
            if (ev.ctrlKey) {
                const fx = ev.x / camera.scale + camera.x;
                const fy = ev.y / camera.scale + camera.y;
                controller.onZoom(fx, fy, 0.001 * ev.deltaY);
            } else if (ev.shiftKey) {
                controller.onScroll(ev.deltaY, ev.deltaX);
            } else {
                controller.onScroll(ev.deltaX, ev.deltaY);
            }
        };

        const container = ref.current;
        if (container === null) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
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
        >
            <Preview page={samplePage} camera={camera} />
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
                    <ModeButton>選択</ModeButton>
                    <ModeButton>長方形</ModeButton>
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
`;
