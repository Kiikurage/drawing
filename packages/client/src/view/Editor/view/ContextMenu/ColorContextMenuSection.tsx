import { css } from '@linaria/core';
import { Popup } from '../Popup';
import { useEditorViewController } from '../EditorControllerContext';
import { ColorPalette, ColorPaletteKey } from '@drawing/common/src/model/ColorPalette';
import { Record } from '@drawing/common/src/model/Record';

export const ColorContextMenuSection = () => {
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

const ColorButton = ({ palette }: { palette: ColorPaletteKey }) => {
    const { pageController, selectionController } = useEditorViewController();

    return (
        <Popup.IconButton
            onClick={() => {
                pageController.updateEntities(
                    Record.mapToRecord(selectionController.selectedEntityIds, (entityId) => [entityId, { palette }])
                );
            }}
        >
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
        </Popup.IconButton>
    );
};
