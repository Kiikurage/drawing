import { css, CSSProperties } from '@linaria/core';
import { ChangeEventHandler, FocusEventHandler, MouseEventHandler, useLayoutEffect, useRef } from 'react';
import { ModelCordBox } from '../../../../model/Box';
import { HorizontalAlign, VerticalAlign } from '../../../../model/TextAlign';
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
    horizontalAlign,
    verticalAlign,
    camera,
    onMouseOver,
    onMouseLeave,
    onChange,
    onBlur,
    onTextOverflow,
}: {
    box: ModelCordBox;
    value: string;
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
    onBlur: FocusEventHandler;
    onTextOverflow?: (contentHeight: number) => void;
}) => {
    const PADDING = 10;

    const ref = useRef<HTMLDivElement | null>(null);
    useLayoutEffect(() => {
        const content = ref.current;
        if (content === null) return;

        const contentHeight = content.getBoundingClientRect().height / camera.scale + PADDING * 2;
        if (box.size.height < contentHeight) {
            onTextOverflow?.(contentHeight);
        }
    });

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
                    inset: ${PADDING}px;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    padding: ${PADDING}px;
                `}
                style={{
                    justifyContent: verticalAlign === 'top' ? 'start' : verticalAlign === 'bottom' ? 'end' : 'center',
                }}
            >
                <div
                    className={css`
                        position: relative;
                        min-height: 28px;
                        overflow: clip;
                    `}
                    style={{
                        textAlign: horizontalAlign,
                    }}
                >
                    <div
                        ref={ref}
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
                            ${ENTITY_FONT_STYLES};
                            width: 100%;
                        `}
                    >
                        {value + (value.endsWith('\n') ? '\u00A0' : '')}
                    </div>
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
    overflow: 'clip',
    fontSize: 28,
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 1.5,
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
