import { useExtension } from '../../core/view/EditorControllerContext';
import { TextExtension } from './TextExtension';
import { Popup } from '../../core/view/Popup';
import { css } from '@linaria/core';

export const TextAlignmentContextMenuSection = () => {
    const extension = useExtension(TextExtension);

    return (
        <Popup.Section
            className={css`
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 4px;
            `}
        >
            <Popup.IconButton onClick={() => extension.setHorizontalTextAlignForSelectedEntities('left')}>
                <span className="material-symbols-outlined">format_align_left</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.setHorizontalTextAlignForSelectedEntities('center')}>
                <span className="material-symbols-outlined">format_align_center</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.setHorizontalTextAlignForSelectedEntities('right')}>
                <span className="material-symbols-outlined">format_align_right</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.setVerticalTextAlignForSelectedEntities('top')}>
                <span className="material-symbols-outlined">vertical_align_top</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.setVerticalTextAlignForSelectedEntities('center')}>
                <span className="material-symbols-outlined">vertical_align_center</span>
            </Popup.IconButton>
            <Popup.IconButton onClick={() => extension.setVerticalTextAlignForSelectedEntities('bottom')}>
                <span className="material-symbols-outlined">vertical_align_bottom</span>
            </Popup.IconButton>
        </Popup.Section>
    );
};
