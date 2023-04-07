import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { createElement, memo } from 'react';
import { useSlice } from '../../../../hooks/useStore';
import { useExtension } from '../../view/EditorControllerContext';
import { Popup } from '../../view/Popup';
import { ToolbarExtension } from './ToolbarExtension';

export const Toolbar = memo(() => {
    const toolbarExtension = useExtension(ToolbarExtension);
    const { items } = useSlice(toolbarExtension.store, (state) => ({
        items: state.items,
    }));

    return (
        <div
            onMouseDown={(ev) => ev.stopPropagation()}
            onMouseUp={(ev) => ev.stopPropagation()}
            onClick={(ev) => ev.stopPropagation()}
            className={css`
                position: absolute;
                bottom: 32px;
                display: flex;
                justify-content: center;
                width: 100%;
            `}
        >
            <Popup.Base>
                <Popup.Section
                    className={css`
                        display: flex;
                        justify-content: center;
                        gap: 4px;
                    `}
                >
                    {items.map((item, i) => createElement(item.view, { key: i }))}
                </Popup.Section>
            </Popup.Base>
        </div>
    );
});
export const ToolbarButton = styled(Popup.Button)`
    width: 48px;
    height: 48px;
`;
