import { css } from '@emotion/react';
import { Store } from '../lib/Store';
import { Camera } from '../model/Camera';
import { Editor } from './Editor/Editor';
import { EditorState } from './Editor/EditorState';

const store = new Store<EditorState>({
    mode: 'select',
    camera: Camera.create(),
});

export const App = () => (
    <div
        css={css`
            position: fixed;
            inset: 0;
        `}
    >
        <Editor store={store} />
    </div>
);
