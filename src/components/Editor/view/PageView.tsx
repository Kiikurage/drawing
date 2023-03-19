import { css } from '@emotion/react';
import { Page } from '../../../model/Page';
import { Camera } from '../model/Camera';
import { EntityView } from './EntityView';

export const PageView = ({ page, camera }: { page: Page; camera: Camera }) => {
    return (
        <div
            css={css`
                transform-origin: 0 0;
                width: 100%;
                height: 100%;

                & > * {
                    pointer-events: none;
                }
            `}
            style={{
                transform: `scale(${camera.scale}) translate(${-camera.point.x}px, ${-camera.point.y}px)`,
            }}
        >
            {page.entities.map((entity, i) => (
                <EntityView entity={entity} key={i} />
            ))}
        </div>
    );
};
