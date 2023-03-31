import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { ButtonHTMLAttributes, memo } from 'react';
import { Point } from '../../../model/Point';
import { useSlice } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { ColorPalette, ColorPaletteKey } from '../model/ColorPalette';
import { Popup } from './Popup';
import { nonNull } from '../../../lib/nonNull';
import { LineEntity } from '../../../model/entity/LineEntity';
import { distinct } from '../../../lib/distinct';

export const ContextMenuPopup = memo(() => {
    const controller = useEditorController();
    const { selectedEntityTypes, camera, contextMenu } = useSlice(controller.store, (state) => {
        return {
            camera: state.camera,
            contextMenu: state.contextMenu,
            selectedEntityTypes: state.contextMenu.open
                ? [
                      ...new Set(
                          state.selectMode.entityIds.map((entityId) => state.page.entities[entityId]?.type ?? '')
                      ),
                  ].sort()
                : [],
        };
    });
    if (!contextMenu.open) return null;

    const { x: left, y: top } = Point.toDisplay(camera, contextMenu.point);
    return (
        <Popup.Base
            className={css`
                z-index: 1000;
                pointer-events: all;
                position: absolute;
            `}
            style={{ top, left }}
        >
            <ColorSection />
            {selectedEntityTypes.every((type) => ['text', 'rect'].includes(type)) && <TextAlignmentSection />}
            {selectedEntityTypes.every((type) => type === 'line') && <ArrowHeadSection />}
        </Popup.Base>
    );
});

const ColorSection = () => {
    return (
        <Popup.Section
            className={css`
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 4px;
            `}
        >
            <ColorButton palette="BLACK" />
            <ColorButton palette="RED" />
            <ColorButton palette="PINK" />

            <ColorButton palette="ORANGE" />
            <ColorButton palette="GRAY" />
            <ColorButton palette="PURPLE" />

            <ColorButton palette="GREEN" />
            <ColorButton palette="ANY_COLOR" />
            <ColorButton palette="BLUE" />
        </Popup.Section>
    );
};

const TextAlignmentSection = () => {
    const controller = useEditorController();

    return (
        <Popup.Section
            className={css`
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 4px;
            `}
        >
            <IconButton onClick={() => controller.setHorizontalTextAlign('left')}>
                <span className="material-symbols-outlined">format_align_left</span>
            </IconButton>
            <IconButton onClick={() => controller.setHorizontalTextAlign('center')}>
                <span className="material-symbols-outlined">format_align_center</span>
            </IconButton>
            <IconButton onClick={() => controller.setHorizontalTextAlign('right')}>
                <span className="material-symbols-outlined">format_align_right</span>
            </IconButton>
            <IconButton onClick={() => controller.setVerticalTextAlign('top')}>
                <span className="material-symbols-outlined">vertical_align_top</span>
            </IconButton>
            <IconButton onClick={() => controller.setVerticalTextAlign('center')}>
                <span className="material-symbols-outlined">vertical_align_center</span>
            </IconButton>
            <IconButton onClick={() => controller.setVerticalTextAlign('bottom')}>
                <span className="material-symbols-outlined">vertical_align_bottom</span>
            </IconButton>
        </Popup.Section>
    );
};

const ArrowHeadSection = () => {
    const controller = useEditorController();
    const { arrowHeadType1, arrowHeadType2 } = useSlice(controller.store, (state) => {
        const lines = state.selectMode.entityIds
            .map((entityId) => state.page.entities[entityId])
            .filter(nonNull) as LineEntity[];

        const arrowHeadTypes1 = lines.map((line) => line.arrowHeadType1).reduce(distinct(), []);
        const arrowHeadType1 = arrowHeadTypes1.length === 1 ? arrowHeadTypes1[0] ?? 'none' : 'none';

        const arrowHeadTypes2 = lines.map((line) => line.arrowHeadType2).reduce(distinct(), []);
        const arrowHeadType2 = arrowHeadTypes2.length === 1 ? arrowHeadTypes2[0] ?? 'none' : 'none';

        return { arrowHeadType1, arrowHeadType2 };
    });

    return (
        <Popup.Section
            className={css`
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 4px;
            `}
        >
            arrowHead
            <IconButton
                aria-pressed={arrowHeadType1 === 'arrow'}
                onClick={() =>
                    controller.setArrowHeadTypeForSelectedEntities('p1', arrowHeadType1 === 'none' ? 'arrow' : 'none')
                }
            >
                <span className="material-symbols-outlined">arrow_back</span>
            </IconButton>
            <IconButton
                aria-pressed={arrowHeadType2 === 'arrow'}
                onClick={() =>
                    controller.setArrowHeadTypeForSelectedEntities('p2', arrowHeadType2 === 'none' ? 'arrow' : 'none')
                }
            >
                <span className="material-symbols-outlined">arrow_forward</span>
            </IconButton>
        </Popup.Section>
    );
};

export const ColorButton = ({ palette }: { palette: ColorPaletteKey }) => {
    const controller = useEditorController();

    return (
        <IconButton onClick={() => controller.setColor(palette)}>
            <div
                className={css`
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    padding: 0;
                    margin: 0;
                    display: block;
                    border: none;
                `}
                style={{
                    background: ColorPalette[palette].strokeColor,
                }}
            />
        </IconButton>
    );
};

export const IconButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <Popup.Button
        className={css`
            width: 40px;
            height: 40px;
        `}
        onMouseDown={(ev) => ev.stopPropagation()}
        onMouseUp={(ev) => ev.stopPropagation()}
        {...props}
    />
);

export const MenuButton = styled(Popup.Button)`
    display: flex;
    width: 100%;
    justify-content: flex-start;
`;
