import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { memo } from 'react';
import { useSlice } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { Popup } from './Popup';

export const ToolBar = memo(() => {
    const controller = useEditorController();
    const { mode } = useSlice(controller.store, (state) => ({
        mode: state.mode,
    }));
    return (
        <div
            css={css`
                position: absolute;
                bottom: 32px;
                display: flex;
                justify-content: center;
                width: 100%;
            `}
        >
            <Popup.Base>
                <div
                    css={css`
                        display: flex;
                        justify-content: center;
                        gap: 4px;
                    `}
                >
                    <ModeButton aria-pressed={mode === 'select'} onClick={() => controller.setMode('select')}>
                        選択
                    </ModeButton>
                    <ModeButton aria-pressed={mode === 'rect'} onClick={() => controller.setMode('rect')}>
                        長方形
                    </ModeButton>
                    <ModeButton aria-pressed={mode === 'line'} onClick={() => controller.setMode('line')}>
                        線
                    </ModeButton>
                    <ModeButton aria-pressed={mode === 'text'} onClick={() => controller.setMode('text')}>
                        文字
                    </ModeButton>
                </div>
            </Popup.Base>
        </div>
    );
});

const ModeButton = styled(Popup.Button)`
    width: 48px;
    height: 48px;
`;
