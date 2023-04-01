import { Camera, DisplayCordPoint, HorizontalAlign, ModelCordBox, VerticalAlign } from '@drawing/common';
import { ChangeEventHandler, MouseEventHandler } from 'react';
import { css } from '@linaria/core';
import { COLOR_SELECTION } from '../../../styles';
import { EditableTextView2 } from './EditableTextView2';

export const EditableTextView = ({
    box,
    value,
    editStartPoint,
    editing,
    highlighted,
    strokeColor,
    fillColor,
    textColor,
    horizontalAlign,
    verticalAlign,
    camera,
    onMouseOver,
    onMouseLeave,
    onChange,
    onContentSizeChange,
}: {
    box: ModelCordBox;
    value: string;
    editStartPoint?: DisplayCordPoint;
    editing: boolean;
    highlighted: boolean;
    strokeColor: string;
    fillColor: string;
    textColor: string;
    verticalAlign: VerticalAlign;
    horizontalAlign: HorizontalAlign;
    camera: Camera;
    onMouseOver: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    onContentSizeChange?: (contentWidth: number, contentHeight: number) => void;
}) => {
    return (
        <div
            className={css`
                position: absolute;
                pointer-events: none;
            `}
            style={{
                left: box.point.x - 10,
                top: box.point.y - 10,
                width: box.size.width + 20,
                height: box.size.height + 20,
            }}
        >
            <svg
                width="100%"
                height="100%"
                className={css`
                    position: absolute;
                `}
            >
                <g transform="translate(10,10)">
                    <rect
                        pointerEvents="all"
                        x={0}
                        y={0}
                        width={box.size.width}
                        height={box.size.height}
                        stroke={strokeColor}
                        strokeWidth={4}
                        fill={fillColor}
                        onMouseOver={onMouseOver}
                        onMouseLeave={onMouseLeave}
                    />
                    {highlighted && (
                        <rect
                            x={0}
                            y={0}
                            width={box.size.width}
                            height={box.size.height}
                            stroke={COLOR_SELECTION}
                            strokeWidth={2 / camera.scale}
                            fill="transparent"
                        />
                    )}
                </g>
            </svg>
            <div
                className={css`
                    display: flex;
                    position: absolute;
                    inset: 10px;
                    flex-direction: column;
                    align-items: stretch;
                `}
                style={{
                    justifyContent: verticalAlign === 'top' ? 'start' : verticalAlign === 'bottom' ? 'end' : 'center',
                }}
            >
                <EditableTextView2
                    value={value}
                    editing={editing}
                    textColor={textColor}
                    horizontalAlign={horizontalAlign}
                    onChange={onChange}
                    camera={camera}
                    editStartPoint={editStartPoint}
                    onContentSizeChange={onContentSizeChange}
                />
            </div>
        </div>
    );
};
