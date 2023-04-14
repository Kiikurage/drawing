import { css } from '@linaria/core';
import { useEditorViewController } from '../EditorControllerContext';
import { Popup } from '../Popup';

export const LayoutContextMenuSection = () => {
    const layout = useEditorViewController().layoutController;

    return (
        <Popup.Section
            className={css`
                display: grid;
                grid-template-columns: auto auto auto;
                justify-content: center;
                gap: 4px;
            `}
        >
            <Popup.IconButton onClick={() => layout.distributeSelectedEntitiesHorizontal()}>
                <span className="material-symbols-outlined">horizontal_distribute</span>
            </Popup.IconButton>
            <span></span>
            <Popup.IconButton onClick={() => layout.distributeSelectedEntitiesVertical()}>
                <span className="material-symbols-outlined">vertical_distribute</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => layout.alignSelectedEntitiesHorizontal('left')}>
                <span className="material-symbols-outlined">align_horizontal_left</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => layout.alignSelectedEntitiesHorizontal('center')}>
                <span className="material-symbols-outlined">align_horizontal_center</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => layout.alignSelectedEntitiesHorizontal('right')}>
                <span className="material-symbols-outlined">align_horizontal_right</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => layout.alignSelectedEntitiesVertical('top')}>
                <span className="material-symbols-outlined">align_vertical_top</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => layout.alignSelectedEntitiesVertical('center')}>
                <span className="material-symbols-outlined">align_vertical_center</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => layout.alignSelectedEntitiesVertical('bottom')}>
                <span className="material-symbols-outlined">align_vertical_bottom</span>
            </Popup.IconButton>
        </Popup.Section>
    );
};
