import { css } from '@emotion/react';
import { MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef } from 'react';
import { Box } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { Point } from '../../../model/Point';
import { COLOR_SELECTION } from '../../styles';
import { useEditorController } from '../EditorControllerContext';
import { AnchorPoint } from '../model/AnchorPoint';
import { Camera } from '../model/Camera';
import { ResizeEntitiesTransaction } from '../model/transaction/ResizeEntitiesTransaction';

export const SelectionView = ({ camera, selectedEntities }: { camera: Camera; selectedEntities: Entity[] }) => {
    const controller = useEditorController();

    const boundingBox = Box.computeBoundingBox(selectedEntities);

    const dragStartPointRef = useRef<Point | null>(null);
    const resizeTransactionRef = useRef<ResizeEntitiesTransaction | null>(null);

    const onMoveHandlerMouseDown = useCallback((ev: ReactMouseEvent) => {
        // ev.stopPropagation();
        // ev.preventDefault();
        // dragStartPointRef.current = { x: ev.screenX, y: ev.screenY };
        //
        // if (!(controller instanceof SelectModeEditorController)) return;
        // resizeTransactionRef.current = controller.onResizeStart(anchorPoint);
    }, []);
    const onResizeHandlerMouseDown = useCallback(
        (ev: ReactMouseEvent, anchor: AnchorPoint) => {
            ev.stopPropagation();
            ev.preventDefault();
            dragStartPointRef.current = { x: ev.screenX, y: ev.screenY };

            const transaction = new ResizeEntitiesTransaction(selectedEntities, anchor);

            controller.applyTransaction(transaction);
            resizeTransactionRef.current = transaction;
        },
        [controller, selectedEntities]
    );
    useEffect(() => {
        const onMouseMove = (ev: MouseEvent) => {
            const dragStartPoint = dragStartPointRef.current;
            const transaction = resizeTransactionRef.current;
            if (dragStartPoint === null || transaction === null) return;

            const dx = ev.screenX - dragStartPoint.x;
            const dy = ev.screenY - dragStartPoint.y;

            transaction.resize(dx / camera.scale, dy / camera.scale);
            controller.applyTransaction(transaction);
        };
        const onMouseUp = () => {
            const dragStartPoint = dragStartPointRef.current;
            const transaction = resizeTransactionRef.current;
            if (dragStartPoint === null || transaction === null) return;

            controller.applyTransaction(transaction);
            dragStartPointRef.current = null;
            resizeTransactionRef.current = null;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [camera.scale, controller]);

    return (
        <svg
            css={css`
                position: absolute;
                left: ${(boundingBox.x - camera.x) * camera.scale - 100}px;
                top: ${(boundingBox.y - camera.y) * camera.scale - 100}px;
            `}
            width={boundingBox.width * camera.scale + 200}
            height={boundingBox.height * camera.scale + 200}
        >
            <rect
                x="100"
                y="100"
                width={boundingBox.width * camera.scale}
                height={boundingBox.height * camera.scale}
                fill="transparent"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={onMoveHandlerMouseDown}
            />
            <rect
                css={css`
                    pointer-events: all;
                `}
                x="96"
                y="96"
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={(ev) => onResizeHandlerMouseDown(ev, 'bottomRight')}
            />
            <rect
                css={css`
                    pointer-events: all;
                `}
                x={96 + boundingBox.width * camera.scale}
                y="96"
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={(ev) => onResizeHandlerMouseDown(ev, 'bottomLeft')}
            />
            <rect
                css={css`
                    pointer-events: all;
                `}
                x="96"
                y={96 + boundingBox.height * camera.scale}
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={(ev) => onResizeHandlerMouseDown(ev, 'topRight')}
            />
            <rect
                css={css`
                    pointer-events: all;
                `}
                x={96 + boundingBox.width * camera.scale}
                y={96 + boundingBox.height * camera.scale}
                width="9"
                height="9"
                fill="#fff"
                stroke={COLOR_SELECTION}
                strokeWidth={1.5}
                onMouseDown={(ev) => onResizeHandlerMouseDown(ev, 'topLeft')}
            />
        </svg>
    );
};
