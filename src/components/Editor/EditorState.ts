import { Camera } from '../../model/Camera';

export interface EditorState {
    mode: 'select' | 'rect';
    camera: Camera;
}
