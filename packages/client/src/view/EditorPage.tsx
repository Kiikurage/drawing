import { css } from '@linaria/core';
import { EditorView } from './Editor/EditorView';
import { Editor } from '../EditorCore/Editor';

export const EditorPage = ({ editor }: { editor: Editor }) => {
    return (
        <div
            className={css`
                position: fixed;
                inset: 0;
            `}
        >
            <EditorView editor={editor} />
        </div>
    );
};
