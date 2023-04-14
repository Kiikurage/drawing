import { dispatcher } from '@drawing/common';
import { MYZoomEvent } from '../model/MYZoomEvent';
import { MYScrollEvent } from '../model/MYScrollEvent';
import { MYPointerEvent } from '../model/MYPointerEvent';
import { MYMouseEvent } from '../model/MYMouseEvent';
import { MYKeyboardEvent } from '../model/MYKeyboardEvent';

export class EditorViewEvents {
    readonly handleZoom = (ev: MYZoomEvent) => this.onZoom.dispatch(ev);
    readonly onZoom = dispatcher<MYZoomEvent>();

    readonly handleScroll = (ev: MYScrollEvent) => this.onScroll.dispatch(ev);
    readonly onScroll = dispatcher<MYScrollEvent>();

    readonly handlePointerDown = (ev: MYPointerEvent) => this.onPointerDown.dispatch(ev);
    readonly onPointerDown = dispatcher<MYPointerEvent>();

    readonly handlePointerMove = (ev: MYPointerEvent) => this.onPointerMove.dispatch(ev);
    readonly onPointerMove = dispatcher<MYPointerEvent>();

    readonly handlePointerUp = (ev: MYPointerEvent) => this.onPointerUp.dispatch(ev);
    readonly onPointerUp = dispatcher<MYPointerEvent>();

    readonly handleDoubleClick = (ev: MYMouseEvent) => this.onDoubleClick.dispatch(ev);
    readonly onDoubleClick = dispatcher<MYMouseEvent>();

    readonly handleKeyDown = (ev: MYKeyboardEvent) => this.onKeyDown.dispatch(ev);
    readonly onKeyDown = dispatcher<MYKeyboardEvent>();

    readonly handleKeyUp = (ev: MYKeyboardEvent) => this.onKeyUp.dispatch(ev);
    readonly onKeyUp = dispatcher<MYKeyboardEvent>();
}
