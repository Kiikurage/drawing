import { css } from '@linaria/core';
import { EditorView } from './Editor/EditorView';

export const EditorPage = () => {
    return (
        <div
            className={css`
                position: fixed;
                inset: 0;
            `}
        >
            <EditorView />
        </div>
    );
};
