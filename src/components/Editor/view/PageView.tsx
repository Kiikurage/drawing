import { css } from '@emotion/react';
import { MouseEventHandler, useCallback } from 'react';
import { Page } from '../../../model/Page';
import { useEditorController } from '../EditorControllerContext';
import { Camera } from '../model/Camera';
import { EntityView } from './EntityView';

export const PageView = ({ page, camera }: { page: Page; camera: Camera }) => {
    const controller = useEditorController();

    const onMouseDown: MouseEventHandler = useCallback(
        (ev) => {
            const x = ev.clientX / camera.scale + camera.x;
            const y = ev.clientY / camera.scale + camera.y;
            controller.onMouseDown(x, y);
        },
        [camera.scale, camera.x, camera.y, controller]
    );

    return (
        <div
            onMouseDown={onMouseDown}
            css={css`
                transform-origin: 0 0;
            `}
            style={{
                transform: `scale(${camera.scale}) translate(${-camera.x}px, ${-camera.y}px)`,
            }}
        >
            {page.entities.map((entity, i) => (
                <EntityView entity={entity} key={i} />
            ))}
        </div>
    );
};
