import { css } from '@emotion/react';
import { RectEntity } from '../model/entity/RectEntity';
import { TextEntity } from '../model/entity/TextEntity';
import { Page } from '../model/Page';
import { Editor } from './Editor/Editor';

const page: Page = {
    entities: [
        RectEntity.create({
            x: 100,
            y: 100,
            width: 100,
            height: 100,
        }),
        TextEntity.create({
            x: 300,
            y: 100,
        }),
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
