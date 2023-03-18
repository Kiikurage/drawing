import { Camera } from '../../model/Camera';
import { Page } from '../../model/Page';

export interface EditorState {
    page: Page;
    mode: 'select' | 'rect';
    camera: Camera;
}
