export module MouseEventButton {
    export const PRIMARY = 0;
    export const WHEEL = 1;
    export const SECONDARY = 2;
}

export type MouseEventButton =
    | typeof MouseEventButton.PRIMARY
    | typeof MouseEventButton.WHEEL
    | typeof MouseEventButton.SECONDARY;
