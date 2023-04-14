import { EditorPage } from '../EditorPage';
import { createEditor } from '../../EditorCore';

const editor = createEditor();

export const App = () => {
    return <EditorPage editor={editor} />;
};
