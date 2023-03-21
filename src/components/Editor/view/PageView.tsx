import { css } from '@emotion/react';
import { useMemo } from 'react';
import { Page } from '../../../model/Page';
import { Camera } from '../model/Camera';
import { computeVisibleEntities } from '../util';
import { EntityView } from './EntityView/EntityView';

export const PageView = ({ page, camera }: { page: Page; camera: Camera }) => {
    const visibleEntities = useMemo(() => computeVisibleEntities(page.entities, camera), [camera, page.entities]);

    return (
        <div
            css={css`
                transform-origin: 0 0;
                width: 100%;
                height: 100%;
            `}
            style={{
                transform: `scale(${camera.scale}) translate(${-camera.point.x}px, ${-camera.point.y}px)`,
            }}
        >
            {Object.values(visibleEntities).map((entity) => (
                <EntityView entity={entity} key={entity.id} />
            ))}
        </div>
    );
};
