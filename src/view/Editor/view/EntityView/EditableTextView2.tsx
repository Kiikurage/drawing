import { css, CSSProperties } from '@linaria/core';
import { ChangeEventHandler, useCallback, useLayoutEffect, useRef } from 'react';
import { caretRangeFromPoint } from '../../../../lib/caretRangeFromPoint';
import { DisplayCordPoint } from '../../../../model/Point';
import { Size } from '../../../../model/Size';
import { HorizontalAlign, VerticalAlign } from '../../../../model/TextAlign';
import { Camera } from '../../model/Camera';

export const EditableTextView2 = ({
    value,
    editStartPoint,
    editing,
    textColor,
    horizontalAlign,
    verticalAlign,
    camera,
    onChange,
    onContentSizeChange,
}: {
    value: string;
    editStartPoint?: DisplayCordPoint;
    editing: boolean;
    textColor: string;
    verticalAlign: VerticalAlign;
    horizontalAlign: HorizontalAlign;
    camera: Camera;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    onContentSizeChange?: (contentWidth: number, contentHeight: number) => void;
}) => {
    const PADDING_X = 6;
    const PADDING_Y = 0;

    const previewRef = useRef<HTMLDivElement | null>(null);
    const contentSizeRef = useRef(Size.model(0, 0));

    useLayoutEffect(() => {
        const content = previewRef.current;
        if (content === null) return;

        const contentWidth = content.scrollWidth + PADDING_X * 2;
        const contentHeight = content.scrollHeight + PADDING_Y * 2;
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
                position: relative;
                padding: ${PADDING_Y}px ${PADDING_X}px;
            `}
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
    );
};

const ENTITY_FONT_STYLES: CSSProperties = {
    fontSize: 28,
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 1.2,
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
    transform: 'translateY(4px)',
};
