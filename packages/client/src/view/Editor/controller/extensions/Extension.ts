import { EditorController } from '../EditorController';

export interface Extension {
    //Extension登録時に呼ばれるハンドラ
    onRegister: (controller: EditorController) => void;
}
