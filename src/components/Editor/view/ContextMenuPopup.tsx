import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Point } from '../../../model/Point';
import { useEditorController } from '../EditorControllerContext';
import { Camera } from '../model/Camera';
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
                <ColorButton color="#212121" />
                <ColorButton color="#C62828" />
                <ColorButton color="#AD1457" />

                <ColorButton color="#EF6C00" />
                <ColorButton color="#546E7A" />
                <ColorButton color="#4527A0" />

                <ColorButton color="#2E7D32" />
                <ColorButton color="#00695C" />
                <ColorButton color="#1565C0" />
            </div>
            <MenuButton>Menu 1</MenuButton>
            <MenuButton>Menu 2</MenuButton>
            <MenuButton>Menu 3</MenuButton>
        </Popup.Base>
    );
};

export const ColorButton = ({ color }: { color: string }) => {
    const controller = useEditorController();

    return (
        <Popup.Button
            css={css`
                width: 40px;
                height: 40px;
            `}
            onMouseDown={(ev) => ev.stopPropagation()}
            onMouseUp={(ev) => ev.stopPropagation()}
            onClick={() => controller.setColor(color)}
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
                    background: ${color};
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
