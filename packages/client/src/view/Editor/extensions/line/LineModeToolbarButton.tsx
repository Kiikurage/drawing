import { LineExtension } from './LineExtension';
import { ToolbarButton } from '../../core/extensions/toolbar/Toolbar';
import { useExtension } from '../../core/view/EditorControllerContext';
import { ModeExtension } from '../mode/ModeExtension';
import { useSlice } from '../../../hooks/useStore';

export const LineModeToolbarButton = () => {
    const modeExtension = useExtension(ModeExtension);
    const { mode } = useSlice(modeExtension.store, (state) => ({ mode: state.mode }));

    return (
        <ToolbarButton
            aria-pressed={mode === LineExtension.MODE_KEY}
            onClick={() => modeExtension.setMode(LineExtension.MODE_KEY)}
        >
            線
        </ToolbarButton>
    );
};
