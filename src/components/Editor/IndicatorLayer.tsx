import { css } from '@emotion/react';
import { Camera } from '../../model/Camera';
import { Entity } from '../../model/Entity';
import { RectEntity } from '../../model/RectEntity';
import { SVGContainer } from '../SVGContainer';

export const IndicatorLayer = ({
    camera,
    selectedEntities,
    hoveredEntity,
}: {
    camera: Camera;
    selectedEntities: Entity[];
    hoveredEntity: Entity | null;
}) => {
    const entitiesSet = new Set<RectEntity>();

    for (const entity of selectedEntities) {
        if (entity.type !== 'rect') continue;
        entitiesSet.add(entity);
    }

    if (hoveredEntity !== null && hoveredEntity.type === 'rect') {
        entitiesSet.add(hoveredEntity);
    }

    const entities = Array.from(entitiesSet);
    if (entities.length === 0) return null;

    return (
        <div
            css={css`
                pointer-events: none;
                position: absolute;
                inset: 0;
            `}
        >
            <SVGContainer camera={camera}>
                {entities.map((entity, i) => (
                    <rect
                        key={i}
                        x={entity.x}
                        y={entity.y}
                        width={entity.width}
                        height={entity.height}
                        fill="transparent"
                        stroke="#4285f4"
                        strokeWidth={1.5 / camera.scale}
                    />
                ))}
            </SVGContainer>
        </div>
    );
};
