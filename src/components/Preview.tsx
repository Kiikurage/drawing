import { css } from '@emotion/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Camera } from '../model/Camera';
import { Page } from '../model/Page';
import { EntityView } from './EntityView';

export const Preview = ({ page, camera }: { page: Page; camera: Camera }) => {
    const ref = useRef<SVGSVGElement>(null);
    const [boundingBox, setBoundingBox] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const svg = ref.current;
        if (svg === null) return;

        const boundingBox = svg.parentElement?.getBoundingClientRect();
        if (boundingBox === undefined) return;

        setBoundingBox({ width: boundingBox.width, height: boundingBox.height });
    }, []);

    const viewBoxWidth = boundingBox.width / camera.scale;
    const viewBoxHeight = boundingBox.height / camera.scale;

    return (
        <svg
            ref={ref}
            css={css`
                position: absolute;
                inset: 0;
            `}
            width={boundingBox.width}
            height={boundingBox.height}
            viewBox={`${camera.x} ${camera.y} ${viewBoxWidth} ${viewBoxHeight}`}
        >
            {page.entities.map((entity, i) => (
                <EntityView entity={entity} key={i} />
            ))}
        </svg>
    );
};
