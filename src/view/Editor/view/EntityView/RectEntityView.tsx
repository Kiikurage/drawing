import { css } from '@emotion/react';
import { RectEntity } from '../../../../model/entity/RectEntity';
import { useStore } from '../../../hooks/useStore';
import { useEditorController } from '../../EditorControllerContext';
import { ColorPalette } from '../../model/ColorPalette';

export const RectEntityView = ({ entity }: { entity: RectEntity }) => {
    const controller = useEditorController();
    const {
        camera,
        textEditMode: { editing, entityId: editingEntityId },
    } = useStore(controller.store);

    const editingThisEntity = editing && editingEntityId === entity.id;

    return (
        <div
            style={{
                position: 'absolute',
                left: entity.p1.x - 10,
                top: entity.p1.y - 10,
                width: entity.size.width + 20,
                height: entity.size.height + 20,
            }}
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
                        width={entity.size.width}
                        height={entity.size.height}
                        stroke={ColorPalette[entity.palette].strokeColor}
                        strokeWidth={4}
                        fill={ColorPalette[entity.palette].fillColor}
                        onMouseOver={() => controller.onHover({ type: 'entity', entityId: entity.id })}
                        onMouseLeave={() => controller.onUnhover()}
                    />
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
                            color: ${editingThisEntity ? 'transparent' : 'inherit'};
                            text-shadow: rgb(249, 250, 251) 0 ${-1 / camera.scale}px 0,
                                rgb(249, 250, 251) 0 ${1 / camera.scale}px 0,
                                rgb(249, 250, 251) ${-1 / camera.scale}px ${-1 / camera.scale}px 0,
                                rgb(249, 250, 251) ${1 / camera.scale}px ${-1 / camera.scale}px 0,
                                rgb(249, 250, 251) ${-1 / camera.scale}px ${1 / camera.scale}px 0,
                                rgb(249, 250, 251) ${1 / camera.scale}px ${1 / camera.scale}px 0;
                        `}
                    >
                        {entity.text + (entity.text.endsWith('\n') ? '\u00A0' : '')}
                    </span>
                    {editingThisEntity && (
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
                                ${ENTITY_FONT_STYLES};
                            `}
                            onMouseDown={(ev) => ev.stopPropagation()}
                            onMouseUp={(ev) => ev.stopPropagation()}
                            onKeyDown={(ev) => ev.stopPropagation()}
                            onKeyUp={(ev) => ev.stopPropagation()}
                            autoFocus
                            onChange={(ev) => controller.setEntityText(entity.id, ev.target.value)}
                            onBlur={() => controller.completeTextEdit()}
                            value={entity.text}
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
    line-height: inherit;
    font-feature-settings: inherit;
    font-variant: inherit;
    font-style: inherit;
    text-align: inherit;
    letter-spacing: inherit;
    text-shadow: inherit;
    outline: none;
    pointer-events: all;
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
