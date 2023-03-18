import { css } from '@emotion/react';
import { MouseEventHandler, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Camera } from '../model/Camera';
import { Page } from '../model/Page';
import { useEditorController } from './Editor/EditorControllerContext';
import { EntityView } from './EntityView';

export const Preview = ({ page, camera }: { page: Page; camera: Camera }) => {
    const controller = useEditorController();
    const ref = useRef<SVGSVGElement>(null);
    const [boundingBox, setBoundingBox] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });

    const onMouseDown: MouseEventHandler = useCallback(
        (ev) => {
            const x = ev.clientX / camera.scale + camera.x;
            const y = ev.clientY / camera.scale + camera.y;
            controller.onMouseDown(x, y);
        },
        [camera.scale, camera.x, camera.y, controller]
    );

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
            onMouseDown={onMouseDown}
        >
            {page.entities.map((entity, i) => (
                <EntityView entity={entity} key={i} />
            ))}
        </svg>
    );
};
