import { css, CSSProperties } from '@linaria/core';
import { ChangeEventHandler, FocusEventHandler, MouseEventHandler } from 'react';
import { ModelCordBox } from '../../../../model/Box';
import { COLOR_SELECTION } from '../../../styles';
import { Camera } from '../../model/Camera';

export const EditableTextView = ({
    box,
    value,
    editing,
    highlighted,
    strokeColor,
    fillColor,
    textColor,
    camera,
    onMouseOver,
    onMouseLeave,
    onChange,
    onBlur,
}: {
    box: ModelCordBox;
    value: string;
    editing: boolean;
    highlighted: boolean;
    strokeColor: string;
    fillColor: string;
    textColor: string;
    camera: Camera;
    onMouseOver: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    onBlur: FocusEventHandler;
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
                    position: absolute;
                    inset: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: center;
                    user-select: none;
                    padding: 10px;
                `}
            >
                <div
                    className={css`
                        position: relative;
                        text-align: center;
                        min-height: 28px;
                    `}
                >
                    <span
                        style={{
                            color: editing ? 'transparent' : textColor,
                            textShadow: `
                            rgb(249, 250, 251) 0 ${-1 / camera.scale}px 0,
                            rgb(249, 250, 251) 0 ${1 / camera.scale}px 0,
                            rgb(249, 250, 251) ${-1 / camera.scale}px ${-1 / camera.scale}px 0,
                            rgb(249, 250, 251) ${1 / camera.scale}px ${-1 / camera.scale}px 0,
                            rgb(249, 250, 251) ${-1 / camera.scale}px ${1 / camera.scale}px 0,
                            rgb(249, 250, 251) ${1 / camera.scale}px ${1 / camera.scale}px 0
                            `,
                        }}
                        className={css`
                            ${ENTITY_FONT_STYLES}
                        `}
                    >
                        {value + (value.endsWith('\n') ? '\u00A0' : '')}
                    </span>
                    {editing && (
                        <textarea
                            className={css`
                                ${ENTITY_FONT_STYLES};
                                padding: 0;
                                position: absolute;
                                inset: 0;
                                resize: none;
                                outline: none;
                                background: transparent;
                                border: none;
                                box-sizing: border-box;
                                overflow: hidden;
                                pointer-events: all;
                            `}
                            style={{
                                color: textColor,
                            }}
                            onMouseDown={(ev) => ev.stopPropagation()}
                            onMouseUp={(ev) => ev.stopPropagation()}
                            onKeyDown={(ev) => ev.stopPropagation()}
                            onKeyUp={(ev) => ev.stopPropagation()}
                            autoFocus
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const ENTITY_FONT_STYLES: CSSProperties = {
    fontSize: 28,
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 1,
    fontFeatureSettings: 'inherit',
    fontVariant: 'inherit',
    fontStyle: 'inherit',
    textAlign: 'inherit',
    letterSpacing: 'inherit',
    textShadow: 'inherit',
    outline: 'none',
    textRendering: 'auto',
    textTransform: 'none',
    textIndent: 0,
    display: 'inline-block',
    appearance: 'auto',
    columnCount: 'auto !important',
    writingMode: 'horizontal-tb !important',
    wordSpacing: 0,
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap',
};
