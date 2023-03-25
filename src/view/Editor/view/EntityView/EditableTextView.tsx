import { css } from '@emotion/react';
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
            css={css`
                position: absolute;
                left: ${box.point.x - 10}px;
                top: ${box.point.y - 10}px;
                width: ${box.size.width + 20}px;
                height: ${box.size.height + 20}px;
                pointer-events: none;
            `}
        >
            <svg
                width="100%"
                height="100%"
                css={css`
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
                css={css`
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
                    css={css`
                        position: relative;
                        text-align: center;
                        min-height: 28px;
                    `}
                >
                    <span
                        css={css`
                            ${ENTITY_FONT_STYLES};
                            color: ${editing ? 'transparent' : textColor};
                            text-shadow: rgb(249, 250, 251) 0 ${-1 / camera.scale}px 0,
                                rgb(249, 250, 251) 0 ${1 / camera.scale}px 0,
                                rgb(249, 250, 251) ${-1 / camera.scale}px ${-1 / camera.scale}px 0,
                                rgb(249, 250, 251) ${1 / camera.scale}px ${-1 / camera.scale}px 0,
                                rgb(249, 250, 251) ${-1 / camera.scale}px ${1 / camera.scale}px 0,
                                rgb(249, 250, 251) ${1 / camera.scale}px ${1 / camera.scale}px 0;
                        `}
                    >
                        {value + (value.endsWith('\n') ? '\u00A0' : '')}
                    </span>
                    {editing && (
                        <textarea
                            css={css`
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
                                ${ENTITY_FONT_STYLES};
                                color: ${textColor};
                            `}
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

const ENTITY_FONT_STYLES = css`
    font-size: 28px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1;
    font-feature-settings: inherit;
    font-variant: inherit;
    font-style: inherit;
    text-align: inherit;
    letter-spacing: inherit;
    text-shadow: inherit;
    outline: none;
    text-rendering: auto;
    text-transform: none;
    text-indent: 0;
    display: inline-block;
    appearance: auto;
    column-count: auto !important;
    writing-mode: horizontal-tb !important;
    word-spacing: 0;
    word-break: break-all;
    white-space: pre-wrap;
`;
