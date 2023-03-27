import { css, CSSProperties } from '@linaria/core';
import { ChangeEventHandler, MouseEventHandler, useCallback, useLayoutEffect, useRef } from 'react';
import { caretRangeFromPoint } from '../../../../lib/caretRangeFromPoint';
import { ModelCordBox } from '../../../../model/Box';
import { DisplayCordPoint } from '../../../../model/Point';
import { Size } from '../../../../model/Size';
import { HorizontalAlign, VerticalAlign } from '../../../../model/TextAlign';
import { COLOR_SELECTION } from '../../../styles';
import { Camera } from '../../model/Camera';

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
    const PADDING = 10;

    const previewRef = useRef<HTMLDivElement | null>(null);
    const contentSizeRef = useRef(Size.model(0, 0));

    useLayoutEffect(() => {
        const content = previewRef.current;
        if (content === null) return;

        const contentWidth = content.scrollWidth + PADDING * 2;
        const contentHeight = content.scrollHeight + PADDING * 2;
        if (contentSizeRef.current.width !== contentWidth || contentSizeRef.current.height !== contentHeight) {
            contentSizeRef.current.width = contentWidth;
            contentSizeRef.current.height = contentHeight;
            onContentSizeChange?.(contentWidth, contentHeight);
        }
    });

    const textareaRef = useCallback(
        (element: HTMLTextAreaElement) => {
            if (previewRef.current === null || editStartPoint === undefined) return;
            const caretPoint = caretRangeFromPoint(previewRef.current, editStartPoint.x, editStartPoint.y);
            if (caretPoint === null) return;

            element?.setSelectionRange(caretPoint.offset, caretPoint.offset);
        },
        [editStartPoint]
    );

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
                        overflow: visible;
                    `}
                    style={{
                        textAlign: horizontalAlign,
                    }}
                >
                    <div
                        ref={previewRef}
                        style={{
                            minWidth: 1,
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
                        `}
                    >
                        {value + (value.endsWith('\n') ? '\u00A0' : '')}
                        {value.length === 0 && '\u00A0'}
                    </div>
                    {editing && (
                        <textarea
                            ref={textareaRef}
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
                                overflow: clip;
                            `}
                            style={{
                                color: textColor,
                            }}
                            onMouseDown={(ev) => ev.stopPropagation()}
                            onMouseUp={(ev) => ev.stopPropagation()}
                            autoFocus
                            onChange={onChange}
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
    wordBreak: 'keep-all',
    whiteSpace: 'pre',
};
