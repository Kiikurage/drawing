import { css } from '@emotion/react';
import { Editor } from './Editor/Editor';

export const App = () => (
    <div
        css={css`
            position: fixed;
            inset: 0;
        `}
    >
        <Editor />
    </div>
);
