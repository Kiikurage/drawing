import { useEditorViewController } from '../EditorControllerContext';
import { createElement, memo } from 'react';
import { useSlice } from '../../../hooks/useSlice';
import { css } from '@linaria/core';
import { Popup } from '../Popup';
import { suppressEvent } from '../../../../lib/stopPropagation';

export const ContextMenuPopup = memo(() => {
    const controller = useEditorViewController();
    const { open, point } = useSlice(controller.contextMenuController.store, (state) => ({
        open: state.open,
        point: state.point,
    }));
    if (!open) return null;

    const sections = controller.contextMenuController.getActiveSections();
    if (sections.length === 0) return null;

    return (
        <Popup.Base
            className={css`
                z-index: 1000;
                pointer-events: all;
                position: absolute;
            `}
            onPointerDown={suppressEvent}
            style={{ top: point.y, left: point.x }}
        >
            {sections.map((section, i) => createElement(section.view, { key: i }))}
        </Popup.Base>
    );
});
