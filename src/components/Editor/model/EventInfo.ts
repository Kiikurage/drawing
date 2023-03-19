export interface EventInfo {
    shiftKey: boolean;
}

export interface KeyboardEventInfo {
    preventDefault: () => void;
    shiftKey: boolean;
    ctrlKey: boolean;
    key: string;
}
