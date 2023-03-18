import { css } from '@emotion/react';
import { Store } from '../lib/Store';
import { Camera } from '../model/Camera';
import { Editor } from './Editor';

const store = new Store<Camera>(Camera.create());

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
