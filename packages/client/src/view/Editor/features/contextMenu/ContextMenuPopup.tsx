import { useExtension } from '../../core/view/EditorControllerContext';
import { createElement, memo } from 'react';
import { useSlice } from '../../../hooks/useStore';
import { css } from '@linaria/core';
import { Popup } from '../../core/view/Popup';
import { ContextMenuExtension } from './ContextMenuExtension';

export const ContextMenuPopup = memo(() => {
    const extension = useExtension(ContextMenuExtension);
    const { open, point } = useSlice(extension.store, (state) => ({
        open: state.open,
        point: state.point,
    }));
    if (!open) return null;

    const sections = extension.getActiveSections();
    if (sections.length === 0) return null;

    return (
        <Popup.Base
            className={css`
                z-index: 1000;
                pointer-events: all;
                position: absolute;
            `}
            style={{ top: point.y, left: point.x }}
        >
            {sections.map((section, i) => createElement(section.view, { key: i }))}
        </Popup.Base>
    );
});
