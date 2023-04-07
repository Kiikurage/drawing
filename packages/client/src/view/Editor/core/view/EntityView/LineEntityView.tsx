import { ColorPalette, Entity, LineEntity, ModelCordPoint, Point } from '@drawing/common';
import { useEditorController, useExtension } from '../EditorControllerContext';
import { useSlice } from '../../../../hooks/useStore';
import { ReactNode, useMemo } from 'react';
import { css } from '@linaria/core';
import { COLOR_SELECTION } from '../../../../styles';
import { EditableTextView2 } from './EditableTextView2';
import { TextEditExtension } from '../../../features/textEdit/TextEditExtension';
import { SelectExtension } from '../../../features/select/SelectExtension';

export const LineEntityView = ({ entity }: { entity: LineEntity }) => {
    const controller = useEditorController();
    const { camera, hovered } = useSlice(controller.store, (state) => {
        return {
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
    const { id, p1, p2, palette } = entity;

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
                strokeWidth={4}
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
                    stroke={ColorPalette[palette].strokeColor}
                    strokeWidth={4}
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
                    stroke={ColorPalette[palette].strokeColor}
                    strokeWidth={4}
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
                    onMouseOver={() => controller.onHover({ type: 'entity', entityId: id })}
                    onMouseLeave={controller.onUnhover}
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
    const R = (40 * Math.PI) / 180;

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
