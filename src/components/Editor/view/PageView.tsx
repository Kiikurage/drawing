import { css } from '@emotion/react';
import { useMemo } from 'react';
import { Box, ModelCordBox } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { Page } from '../../../model/Page';
import { Point } from '../../../model/Point';
import { Size } from '../../../model/Size';
import { Camera } from '../model/Camera';
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
            {visibleEntities.map((entity, i) => (
                <EntityView entity={entity} key={i} />
            ))}
        </div>
    );
};

function computeVisibleEntities(entities: Entity[], camera: Camera): Entity[] {
    const box1: ModelCordBox = Box.toModel(camera, {
        point: Point.display(0, 0),
        size: Size.display(window.innerWidth, window.innerHeight),
    });

    return entities.filter((entity) => {
        const box2 = Entity.getBoundingBox(entity);

        return (
            box1.point.x < box2.point.x + box2.size.width &&
            box2.point.x < box1.point.x + box1.size.width &&
            box1.point.y < box2.point.y + box2.size.height &&
            box2.point.y < box1.point.y + box1.size.height
        );
    });
}
