import { css } from '@linaria/core';
import { Editor } from './Editor/Editor';

export const EditorPage = () => {
    return (
        <div
            className={css`
                position: fixed;
                inset: 0;
            `}
        >
            <Editor />
        </div>
    );
};
