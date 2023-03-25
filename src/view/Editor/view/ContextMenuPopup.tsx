import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Point } from '../../../model/Point';
import { useEditorController } from '../EditorControllerContext';
import { Camera } from '../model/Camera';
import { ColorPalette, ColorPaletteKey } from '../model/ColorPalette';
import { ContextMenuState } from '../model/ContextMenuState';
import { Popup } from './Popup';

export const ContextMenuPopup = ({ camera, state }: { camera: Camera; state: ContextMenuState }) => {
    if (!state.open) return null;

    const { x: left, y: top } = Point.toDisplay(camera, state.point);
    return (
        <Popup.Base
            css={css`
                z-index: 1000;
                pointer-events: all;
                position: absolute;
            `}
            style={{
                top,
                left,
            }}
        >
            <div
                css={css`
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
            </div>
            <MenuButton>Menu 1</MenuButton>
            <MenuButton>Menu 2</MenuButton>
            <MenuButton>Menu 3</MenuButton>
        </Popup.Base>
    );
};

export const ColorButton = ({ palette }: { palette: ColorPaletteKey }) => {
    const controller = useEditorController();

    return (
        <Popup.Button
            css={css`
                width: 40px;
                height: 40px;
            `}
            onMouseDown={(ev) => ev.stopPropagation()}
            onMouseUp={(ev) => ev.stopPropagation()}
            onClick={() => controller.setColor(palette)}
        >
            <div
                css={css`
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    padding: 0;
                    margin: 0;
                    display: block;
                    border: none;
                    background: ${ColorPalette[palette].strokeColor};
                `}
            />
        </Popup.Button>
    );
};
export const MenuButton = styled(Popup.Button)`
    display: flex;
    width: 100%;
    justify-content: flex-start;
`;
