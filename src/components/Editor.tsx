import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { Camera } from '../model/Camera';
import { Page } from '../model/Page';
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

export const Editor = () => {
    const [camera, setCamera] = useState<Camera>(Camera.create);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleWheel = (ev: WheelEvent) => {
            ev.preventDefault();
            if (ev.ctrlKey) {
                setCamera((prevState) => {
                    const newScale = Math.max(0.1, Math.min(prevState.scale - 0.001 * ev.deltaY, 2));
                    const fx = ev.x / prevState.scale + prevState.x;
                    const fy = ev.y / prevState.scale + prevState.y;
                    return Camera.setScale(prevState, fx, fy, newScale);
                });
            } else if (ev.shiftKey) {
                setCamera((prevState) => ({
                    ...prevState,
                    x: prevState.x + ev.deltaY,
                }));
            } else {
                setCamera((prevState) => ({
                    ...prevState,
                    y: prevState.y + ev.deltaY,
                }));
            }
        };

        const container = ref.current;
        if (container === null) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div
            ref={ref}
            css={css`
                position: absolute;
                inset: 0;
            `}
        >
            <Preview page={samplePage} camera={camera} />
        </div>
    );
};
