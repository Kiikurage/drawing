export interface MYKeyboardEvent {
    preventDefault: () => void;
    shiftKey: boolean;
    ctrlKey: boolean;
    key: string;
}
