import { useEditorViewController } from '../EditorControllerContext';
import React, { useMemo } from 'react';
import { SVGContainer } from '../CameraLayer/SVGContainer';
import { EdgeHandle, SquareHandle } from './Handle';
import { COLOR_SELECTION } from '../../../styles';
import { useCamera } from '../../../hooks/useCamera';
import { useSelectedEntities } from '../../../hooks/useSelection';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { Point } from '@drawing/common/src/model/Point';
import { TransformType } from '@drawing/common/src/model/TransformType';

export const SimpleSelectionView = () => {
    const controller = useEditorViewController();
    const camera = useCamera();
    const selectedEntities = useSelectedEntities();
    const selectionBoundingBox = useMemo(() => Entity.computeBoundingBox(selectedEntities), [selectedEntities]);
    const {
        size: { width, height },
    } = selectionBoundingBox;
    const pTopLeft = Point.model(0, 0);
    const pTopRight = Point.model(width, 0);
    const pBottomLeft = Point.model(0, height);
    const pBottomRight = Point.model(width, height);

    return (
        <SVGContainer viewport={selectionBoundingBox}>
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                cursor="move"
                pointerEvents="all"
                fill="transparent"
                stroke={COLOR_SELECTION}
                strokeWidth={2 / camera.scale}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.TRANSLATE,
                    });
                }}
            />
            <EdgeHandle
                cursor="ns-resize"
                p1={pTopLeft}
                p2={pTopRight}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.RESIZE_TOP,
                    });
                }}
            />
            <EdgeHandle
                cursor="ew-resize"
                p1={pTopLeft}
                p2={pBottomLeft}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.RESIZE_LEFT,
                    });
                }}
            />
            <EdgeHandle
                cursor="ew-resize"
                p1={pTopRight}
                p2={pBottomRight}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.RESIZE_RIGHT,
                    });
                }}
            />
            <EdgeHandle
                cursor="ns-resize"
                p1={pBottomLeft}
                p2={pBottomRight}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.RESIZE_BOTTOM,
                    });
                }}
            />
            <SquareHandle
                cursor="nwse-resize"
                x={0}
                y={0}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.RESIZE_TOP_LEFT,
                    });
                }}
            />
            <SquareHandle
                cursor="nesw-resize"
                x={width}
                y={0}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.RESIZE_TOP_RIGHT,
                    });
                }}
            />
            <SquareHandle
                cursor="nesw-resize"
                x={0}
                y={height}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.RESIZE_BOTTOM_LEFT,
                    });
                }}
            />
            <SquareHandle
                cursor="nwse-resize"
                x={width}
                y={height}
                onPointerDown={(ev) => {
                    ev.stopPropagation();
                    controller.handlePointerDown(ev.nativeEvent, {
                        type: 'transformHandle',
                        transformType: TransformType.RESIZE_BOTTOM_RIGHT,
                    });
                }}
            />
        </SVGContainer>
    );
};
