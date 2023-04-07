import { SelectExtension } from './SelectExtension';
import { ToolbarButton } from '../toolbar/Toolbar';
import { useExtension } from '../../view/EditorControllerContext';
import { ModeExtension } from '../../../extensions/mode/ModeExtension';
import { useSlice } from '../../../../hooks/useStore';

export const SelectModeToolbarButton = () => {
    const modeExtension = useExtension(ModeExtension);
    const { mode } = useSlice(modeExtension.store, (state) => ({ mode: state.mode }));

    return (
        <ToolbarButton
            aria-pressed={mode === SelectExtension.MODE_KEY}
            onClick={() => modeExtension.setMode(SelectExtension.MODE_KEY)}
        >
            選択
        </ToolbarButton>
    );
};
