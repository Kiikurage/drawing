export interface MouseEventInfo {
    preventDefault: () => void;
    shiftKey: boolean;
    button: number;
}

export module MouseEventButton {
    export const PRIMARY = 0;
    export const WHEEL = 1;
    export const SECONDARY = 2;
}

export type MouseEventButton =
    | typeof MouseEventButton.PRIMARY
    | typeof MouseEventButton.WHEEL
    | typeof MouseEventButton.SECONDARY;

export interface KeyboardEventInfo {
    preventDefault: () => void;
    shiftKey: boolean;
    ctrlKey: boolean;
    key: string;
}
