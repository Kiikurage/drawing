import { RectExtension } from './RectExtension';
import { ToolbarButton } from '../../core/extensions/toolbar/Toolbar';
import { useExtension } from '../../core/view/EditorControllerContext';
import { ModeExtension } from '../mode/ModeExtension';
import { useSlice } from '../../../hooks/useStore';

export const RectModeToolbarButton = () => {
    const modeExtension = useExtension(ModeExtension);
    const { mode } = useSlice(modeExtension.store, (state) => ({ mode: state.mode }));

    return (
        <ToolbarButton
            aria-pressed={mode === RectExtension.MODE_KEY}
            onClick={() => modeExtension.setMode(RectExtension.MODE_KEY)}
        >
            長方形
        </ToolbarButton>
    );
};
