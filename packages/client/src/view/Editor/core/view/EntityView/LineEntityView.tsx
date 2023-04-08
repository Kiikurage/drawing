import { ColorPalette, Entity, LineEntity, ModelCordPoint, Point } from '@drawing/common';
import { useEditorController, useExtension } from '../EditorControllerContext';
import { useSlice } from '../../../../hooks/useStore';
import { ReactNode, useMemo } from 'react';
import { css } from '@linaria/core';
import { COLOR_SELECTION } from '../../../../styles';
import { EditableTextView2 } from './EditableTextView2';
import { TextEditExtension } from '../../extensions/textEdit/TextEditExtension';
import { SelectExtension } from '../../extensions/select/SelectExtension';
import { getLineIntersectPoint } from '@drawing/common/build/model/page/entity/lineUtil';

export const LineEntityView = ({ entity }: { entity: LineEntity }) => {
    const controller = useEditorController();
    const { linkedEntity1, linkedEntity2, camera, hovered } = useSlice(controller.store, (state) => {
        return {
            linkedEntity1: entity.linkedEntityId1 === null ? null : state.page.entities[entity.linkedEntityId1],
            linkedEntity2: entity.linkedEntityId2 === null ? null : state.page.entities[entity.linkedEntityId2],
            camera: state.camera,
            hovered: state.hover.type === 'entity' && state.hover.entityId === entity.id,
        };
    });

    const textEditExtension = useExtension(TextEditExtension);
    const { textEditing } = useSlice(textEditExtension.store, (state) => {
        return { textEditing: state.entityId === entity.id };
    });

    const selectExtension = useExtension(SelectExtension);
    const { selected } = useSlice(selectExtension.store, (state) => {
        return { selected: entity.id in state.entities };
    });

    const highlighted = hovered || selected;
    const { id, palette } = entity;
    let { p1, p2 } = entity;
    if (linkedEntity1 !== null) {
        const box = Entity.getBoundingBox(linkedEntity1);
        const linkedEntity1p11 = box.point;
        const linkedEntity1p12 = Point.model(box.point.x, box.point.y + box.size.height);
        const linkedEntity1p21 = Point.model(box.point.x + box.size.width, box.point.y);
        const linkedEntity1p22 = Point.model(box.point.x + box.size.width, box.point.y + box.size.height);
        p1 =
            getLineIntersectPoint(p1, p2, linkedEntity1p11, linkedEntity1p12) ??
            getLineIntersectPoint(p1, p2, linkedEntity1p12, linkedEntity1p22) ??
            getLineIntersectPoint(p1, p2, linkedEntity1p22, linkedEntity1p21) ??
            getLineIntersectPoint(p1, p2, linkedEntity1p21, linkedEntity1p11) ??
            p1;
    }
    if (linkedEntity2 !== null) {
        const box = Entity.getBoundingBox(linkedEntity2);
        const linkedEntity2p11 = box.point;
        const linkedEntity2p12 = Point.model(box.point.x, box.point.y + box.size.height);
        const linkedEntity2p21 = Point.model(box.point.x + box.size.width, box.point.y);
        const linkedEntity2p22 = Point.model(box.point.x + box.size.width, box.point.y + box.size.height);
        p2 =
            getLineIntersectPoint(p1, p2, linkedEntity2p11, linkedEntity2p12) ??
            getLineIntersectPoint(p1, p2, linkedEntity2p12, linkedEntity2p22) ??
            getLineIntersectPoint(p1, p2, linkedEntity2p22, linkedEntity2p21) ??
            getLineIntersectPoint(p1, p2, linkedEntity2p21, linkedEntity2p11) ??
            p2;
    }

    const {
        point: origin,
        size: { width, height },
    } = Entity.getBoundingBox(entity);

    const content = useMemo(() => {
        const content: ReactNode[] = [
            <path
                key="main"
                d={`M${p1.x - origin.x},${p1.y - origin.y} L${p2.x - origin.x},${p2.y - origin.y}`}
                stroke={ColorPalette[palette].strokeColor}
                strokeLinecap="round"
                strokeWidth={6}
            />,
        ];

        if (entity.arrowHeadType1 === 'arrow') {
            const [p3, p4] = computeArrowHeadPoint(p1, p2);
            content.push(
                <path
                    key="arrowHeadForP1"
                    d={`M${p3.x - origin.x},${p3.y - origin.y} L${p1.x - origin.x},${p1.y - origin.y} L${
                        p4.x - origin.x
                    },${p4.y - origin.y}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke={ColorPalette[palette].strokeColor}
                    strokeWidth={6}
                />
            );
        }

        if (entity.arrowHeadType2 === 'arrow') {
            const [p3, p4] = computeArrowHeadPoint(p2, p1);
            content.push(
                <path
                    key="arrowHeadForP2"
                    d={`M${p3.x - origin.x},${p3.y - origin.y} L${p2.x - origin.x},${p2.y - origin.y} L${
                        p4.x - origin.x
                    },${p4.y - origin.y}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke={ColorPalette[palette].strokeColor}
                    strokeWidth={6}
                />
            );
        }

        return content;
    }, [entity.arrowHeadType1, entity.arrowHeadType2, origin.x, origin.y, p1, p2, palette]);

    return (
        <div
            className={css`
                position: absolute;
            `}
            style={{
                width: width,
                height: height,
                left: origin.x,
                top: origin.y,
            }}
        >
            <svg
                className={css`
                    position: absolute;
                `}
                style={{
                    left: -100,
                    top: -100,
                }}
                width={width + 200}
                height={height + 200}
            >
                <g
                    transform="translate(100,100)"
                    pointerEvents="all"
                    onMouseOver={() => controller.handleHover({ type: 'entity', entityId: id })}
                    onMouseLeave={controller.handleUnhover}
                >
                    {content}
                    {highlighted && (
                        <path
                            d={`M${p1.x - origin.x},${p1.y - origin.y} L${p2.x - origin.x},${p2.y - origin.y}`}
                            stroke={COLOR_SELECTION}
                            strokeWidth={2 / camera.scale}
                        />
                    )}
                </g>
            </svg>
            {(textEditing || entity.text !== '') && (
                <div
                    style={{
                        position: 'absolute',
                        left: width / 2,
                        top: height / 2,
                        transform: `translate(-50%, -50%)`,
                        // background: '#fff',
                        borderRadius: 8,
                    }}
                >
                    <EditableTextView2
                        value={entity.text}
                        editing={textEditing}
                        textColor="#000"
                        horizontalAlign="center"
                        camera={camera}
                        onChange={(ev) => textEditExtension.updateEditingText(entity.id, ev.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * @param p1 The point of the line which has arrowhead.
 * @param p2 The other point of the line.
 */
function computeArrowHeadPoint(p1: ModelCordPoint, p2: ModelCordPoint): [ModelCordPoint, ModelCordPoint] {
    const SIZE = 20;
    const R = (25 * Math.PI) / 180;

    const vx = p2.x - p1.x;
    const vy = p2.y - p1.y;
    const vNorm = Math.sqrt(vx ** 2 + vy ** 2);

    const v3x = ((vx * Math.cos(R) - vy * Math.sin(R)) * SIZE) / vNorm;
    const v3y = ((vx * Math.sin(R) + vy * Math.cos(R)) * SIZE) / vNorm;

    const v4x = ((vx * Math.cos(-R) - vy * Math.sin(-R)) * SIZE) / vNorm;
    const v4y = ((vx * Math.sin(-R) + vy * Math.cos(-R)) * SIZE) / vNorm;

    const p3 = Point.model(p1.x + v3x, p1.y + v3y);
    const p4 = Point.model(p1.x + v4x, p1.y + v4y);

    return [p3, p4];
}
