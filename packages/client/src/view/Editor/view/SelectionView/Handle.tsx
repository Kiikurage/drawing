import { memo, PointerEventHandler } from 'react';
import { COLOR_SELECTION } from '../../../styles';
import { ModelCordPoint } from '@drawing/common';
import { useCamera } from '../../../hooks/useCamera';

export const SquareHandle = memo(
    ({
        x,
        y,
        size = 10,
        hitSize = 24,
        cursor,
        onPointerDown,
    }: {
        x: number;
        y: number;
        size?: number;
        hitSize?: number;
        cursor?: string;
        onPointerDown?: PointerEventHandler;
    }) => {
        const camera = useCamera();

        return (
            <g>
                <rect
                    x={x - hitSize / 2 / camera.scale}
                    y={y - hitSize / 2 / camera.scale}
                    width={hitSize / camera.scale}
                    height={hitSize / camera.scale}
                    pointerEvents="all"
                    fill="none"
                    stroke="none"
                    cursor={cursor}
                    onPointerDown={onPointerDown}
                />
                <rect
                    x={x - size / 2 / camera.scale}
                    y={y - size / 2 / camera.scale}
                    width={size / camera.scale}
                    height={size / camera.scale}
                    fill="#fff"
                    stroke={COLOR_SELECTION}
                    strokeWidth={2 / camera.scale}
                />
            </g>
        );
    }
);

export const CircleHandle = memo(
    ({
        x,
        y,
        size = 6,
        hitSize = 24,
        cursor,
        onPointerDown,
    }: {
        x: number;
        y: number;
        size?: number;
        hitSize?: number;
        cursor?: string;
        onPointerDown?: PointerEventHandler;
    }) => {
        const camera = useCamera();

        return (
            <g>
                <circle
                    cx={x}
                    cy={y}
                    r={hitSize / camera.scale}
                    pointerEvents="all"
                    fill="transparent"
                    stroke="none"
                    cursor={cursor}
                    onPointerDown={onPointerDown}
                />
                <circle
                    cx={x}
                    cy={y}
                    r={size / camera.scale}
                    fill="#fff"
                    stroke={COLOR_SELECTION}
                    strokeWidth={2 / camera.scale}
                />
            </g>
        );
    }
);

export const EdgeHandle = memo(
    ({
        p1,
        p2,
        hitSize = 24,
        cursor,
        onPointerDown,
    }: {
        p1: ModelCordPoint;
        p2: ModelCordPoint;
        hitSize?: number;
        cursor?: string;
        onPointerDown?: PointerEventHandler;
    }) => {
        const camera = useCamera();

        return (
            <path
                d={`M${p1.x} ${p1.y}L${p2.x} ${p2.y}`}
                pointerEvents="all"
                strokeWidth={hitSize / camera.scale}
                stroke="transparent"
                fill="none"
                cursor={cursor}
                onPointerDown={onPointerDown}
            />
        );
    }
);
