import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { memo } from 'react';
import { useSlice } from '../../../hooks/useStore';
import { useExtension } from './EditorControllerContext';
import { Popup } from './Popup';
import { ModeExtension } from '../../features/mode/ModeExtension';
import { SelectExtension } from '../../features/select/SelectExtension';
import { RectExtension } from '../../features/rect/RectExtension';
import { LineExtension } from '../../features/line/LineExtension';
import { TextExtension } from '../../features/text/TextExtension';

export const ToolBar = memo(() => {
    const modeExtension = useExtension(ModeExtension);
    const { mode } = useSlice(modeExtension.store, (state) => ({
        mode: state.mode,
    }));

    return (
        <div
            onMouseDown={(ev) => ev.stopPropagation()}
            onMouseUp={(ev) => ev.stopPropagation()}
            onClick={(ev) => ev.stopPropagation()}
            className={css`
                position: absolute;
                bottom: 32px;
                display: flex;
                justify-content: center;
                width: 100%;
            `}
        >
            <Popup.Base>
                <Popup.Section
                    className={css`
                        display: flex;
                        justify-content: center;
                        gap: 4px;
                    `}
                >
                    <ModeButton
                        aria-pressed={mode === SelectExtension.MODE_KEY}
                        onClick={() => modeExtension.setMode(SelectExtension.MODE_KEY)}
                    >
                        選択
                    </ModeButton>
                    <ModeButton
                        aria-pressed={mode === RectExtension.MODE_KEY}
                        onClick={() => modeExtension.setMode(RectExtension.MODE_KEY)}
                    >
                        長方形
                    </ModeButton>
                    <ModeButton
                        aria-pressed={mode === LineExtension.MODE_KEY}
                        onClick={() => modeExtension.setMode(LineExtension.MODE_KEY)}
                    >
                        線
                    </ModeButton>
                    <ModeButton
                        aria-pressed={mode === TextExtension.MODE_KEY}
                        onClick={() => modeExtension.setMode(TextExtension.MODE_KEY)}
                    >
                        文字
                    </ModeButton>
                </Popup.Section>
            </Popup.Base>
        </div>
    );
});

const ModeButton = styled(Popup.Button)`
    width: 48px;
    height: 48px;
`;
