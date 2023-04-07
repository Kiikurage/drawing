import { TextExtension } from './TextExtension';
import { ToolbarButton } from '../../core/extensions/toolbar/Toolbar';
import { useExtension } from '../../core/view/EditorControllerContext';
import { ModeExtension } from '../mode/ModeExtension';
import { useSlice } from '../../../hooks/useStore';

export const TextModeToolbarButton = () => {
    const modeExtension = useExtension(ModeExtension);
    const { mode } = useSlice(modeExtension.store, (state) => ({ mode: state.mode }));

    return (
        <ToolbarButton
            aria-pressed={mode === TextExtension.MODE_KEY}
            onClick={() => modeExtension.setMode(TextExtension.MODE_KEY)}
        >
            文字
        </ToolbarButton>
    );
};
