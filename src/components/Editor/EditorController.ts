import { Store } from '../../lib/Store';
import { EditorState } from './EditorState';

export class EditorController {
    constructor(protected readonly store: Store<EditorState>) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onZoom(fx: number, fy: number, diff: number) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onScroll(dx: number, dy: number) {}
}
