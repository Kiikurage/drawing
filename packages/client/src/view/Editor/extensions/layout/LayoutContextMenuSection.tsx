import { css } from '@linaria/core';
import { useExtension } from '../../core/view/EditorControllerContext';
import { Popup } from '../../core/view/Popup';
import { LayoutExtension } from './LayoutExtension';

export const LayoutContextMenuSection = () => {
    const extension = useExtension(LayoutExtension);

    return (
        <Popup.Section
            className={css`
                display: grid;
                grid-template-columns: auto auto auto;
                justify-content: center;
                gap: 4px;
            `}
        >
            <Popup.IconButton onClick={() => extension.distributeSelectedEntitiesHorizontal()}>
                <span className="material-symbols-outlined">horizontal_distribute</span>
            </Popup.IconButton>
            <span></span>
            <Popup.IconButton onClick={() => extension.distributeSelectedEntitiesVertical()}>
                <span className="material-symbols-outlined">vertical_distribute</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.alignSelectedEntitiesHorizontal('left')}>
                <span className="material-symbols-outlined">align_horizontal_left</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.alignSelectedEntitiesHorizontal('center')}>
                <span className="material-symbols-outlined">align_horizontal_center</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.alignSelectedEntitiesHorizontal('right')}>
                <span className="material-symbols-outlined">align_horizontal_right</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.alignSelectedEntitiesVertical('top')}>
                <span className="material-symbols-outlined">align_vertical_top</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.alignSelectedEntitiesVertical('center')}>
                <span className="material-symbols-outlined">align_vertical_center</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.alignSelectedEntitiesVertical('bottom')}>
                <span className="material-symbols-outlined">align_vertical_bottom</span>
            </Popup.IconButton>
        </Popup.Section>
    );
};
