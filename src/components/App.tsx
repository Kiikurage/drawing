import { css } from '@emotion/react';
import { Page } from '../model/Page';
import { Editor } from './Editor/Editor';

const page: Page = {
    entities: [
        {
            type: 'rect',
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            strokeColor: '#000',
            fillColor: 'transparent',
        },
        {
            type: 'text',
            x: 300,
            y: 100,
            value: 'Hello World!',
        },
    ],
};

export const App = () => (
    <div
        css={css`
            position: fixed;
            inset: 0;
        `}
    >
        <Editor defaultValue={page} />
    </div>
);
