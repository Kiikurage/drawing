import { ChangeEventHandler, useCallback, useLayoutEffect, useRef } from 'react';
import { css, CSSProperties } from '@linaria/core';
import { caretRangeFromPoint } from '../../../../lib/caretRangeFromPoint';
import { DisplayCordPoint } from '@drawing/common/src/model/Point';
import { Camera } from '@drawing/common/src/model/Camera';
import { Size } from '@drawing/common/src/model/Size';

export const EditableText = ({
    value,
    editStartPoint,
    editing = false,
    textColor = '#000',
    camera,
    onChange,
    onContentSizeChange,
}: {
    value: string;
    editStartPoint?: DisplayCordPoint;
    editing?: boolean;
    textColor?: string;
    camera: Camera;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    onContentSizeChange?: (contentWidth: number, contentHeight: number) => void;
}) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const contentSizeRef = useRef(Size.model(0, 0));

    useLayoutEffect(() => {
        const content = contentRef.current;
        if (content === null) return;

        const contentWidth = content.scrollWidth;
        const contentHeight = content.scrollHeight;
        if (contentSizeRef.current.width !== contentWidth || contentSizeRef.current.height !== contentHeight) {
            contentSizeRef.current.width = contentWidth;
            contentSizeRef.current.height = contentHeight;
            onContentSizeChange?.(contentWidth, contentHeight);
        }
    });

    const textareaRef = useCallback(
        (element: HTMLTextAreaElement) => {
            if (contentRef.current === null || editStartPoint === undefined) return;
            const caretPoint = caretRangeFromPoint(contentRef.current, editStartPoint.x, editStartPoint.y);
            if (caretPoint === null) return;

            element?.setSelectionRange(caretPoint.offset, caretPoint.offset);
        },
        [editStartPoint]
    );

    return (
        <div
            ref={contentRef}
            className={css`
                position: relative;
            `}
        >
            <div
                style={{
                    minWidth: 1,
                    color: textColor,
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
                        position: absolute;
                        inset: 0;
                        resize: none;
                        outline: none;
                        background: transparent;
                        border: none;
                        box-sizing: border-box;
                        overflow: clip;
                    `}
                    style={{
                        color: textColor,
                        pointerEvents: editing ? 'all' : 'none',
                    }}
                    onMouseDown={(ev) => ev.stopPropagation()}
                    onMouseUp={(ev) => ev.stopPropagation()}
                    onKeyDown={(ev) => ev.stopPropagation()}
                    onKeyUp={(ev) => ev.stopPropagation()}
                    autoFocus
                    onChange={onChange}
                    value={value}
                />
            )}
        </div>
    );
};

const PADDING_X = 6;
const PADDING_Y = 0;

const ENTITY_FONT_STYLES: CSSProperties = {
    padding: `${PADDING_Y}px ${PADDING_X}px`,
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
    wordBreak: 'break-all',
    whiteSpace: 'pre',
    transform: 'translateY(4px)',
};
