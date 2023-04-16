import { EditorPage } from '../EditorPage';
import { createEditor } from '../../../../common/src/Editor';

const editor = createEditor();

export const App = () => {
    return <EditorPage editor={editor} />;
};
