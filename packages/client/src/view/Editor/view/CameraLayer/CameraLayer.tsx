import { css } from '@linaria/core';
import { memo, ReactNode } from 'react';
import { useCamera } from '../../../hooks/useCamera';

export const CameraLayer = memo(({ children }: { children?: ReactNode }) => {
    const camera = useCamera();

    return (
        <div
            className={css`
                position: absolute;
                inset: 0;
                transform-origin: 0 0;
            `}
            style={{
                transform: `scale(${camera.scale}) translate(${-camera.point.x}px, ${-camera.point.y}px)`,
            }}
        >
            {children}
        </div>
    );
});
