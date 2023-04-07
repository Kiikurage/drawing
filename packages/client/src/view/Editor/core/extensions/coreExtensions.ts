import { ContextMenuExtension } from './contextMenu/ContextMenuExtension';
import { ToolbarExtension } from './toolbar/ToolbarExtension';
import { TextEditExtension } from './textEdit/TextEditExtension';
import { RangeSelectExtension } from './select/RangeSelectExtension';
import { SelectExtension } from './select/SelectExtension';

export const CoreExtensions = [
    ContextMenuExtension,
    RangeSelectExtension,
    SelectExtension,
    TextEditExtension,
    ToolbarExtension,
];
