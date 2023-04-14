import { useEditorViewController } from '../EditorControllerContext';
import { Popup } from '../Popup';
import { css } from '@linaria/core';

export const TextAlignmentContextMenuSection = () => {
    const text = useEditorViewController().textController;

    return (
        <Popup.Section
            className={css`
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 4px;
            `}
        >
            <Popup.IconButton onClick={() => text.setHorizontalTextAlignForSelectedEntities('left')}>
                <span className="material-symbols-outlined">format_align_left</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => text.setHorizontalTextAlignForSelectedEntities('center')}>
                <span className="material-symbols-outlined">format_align_center</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => text.setHorizontalTextAlignForSelectedEntities('right')}>
                <span className="material-symbols-outlined">format_align_right</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => text.setVerticalTextAlignForSelectedEntities('top')}>
                <span className="material-symbols-outlined">vertical_align_top</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => text.setVerticalTextAlignForSelectedEntities('center')}>
                <span className="material-symbols-outlined">vertical_align_center</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => text.setVerticalTextAlignForSelectedEntities('bottom')}>
                <span className="material-symbols-outlined">vertical_align_bottom</span>
            </Popup.IconButton>
        </Popup.Section>
    );
};
