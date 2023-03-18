import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import { Store } from '../lib/Store';
import { Camera } from '../model/Camera';
import { Page } from '../model/Page';
import { useStore } from './hooks/useStore';
import { Preview } from './Preview';

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
export const Editor = ({ store }: { store: Store<Camera> }) => {
    const camera = useStore(store);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleWheel = (ev: WheelEvent) => {
            ev.preventDefault();
            if (ev.ctrlKey) {
                store.setState((prevState) => {
                    const newScale = Math.max(0.1, Math.min(prevState.scale - 0.001 * ev.deltaY, 2));
                    const fx = ev.x / prevState.scale + prevState.x;
                    const fy = ev.y / prevState.scale + prevState.y;
                    return Camera.setScale(prevState, fx, fy, newScale);
                });
            } else if (ev.shiftKey) {
                store.setState((prevState) => ({ x: prevState.x + ev.deltaY }));
            } else {
                store.setState((prevState) => ({ y: prevState.y + ev.deltaY }));
            }
        };

        const container = ref.current;
        if (container === null) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [store]);

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
