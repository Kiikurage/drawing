import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { EditorMode } from '../model/EditorMode';
import { Popup } from './Popup';

export const ToolBar = ({ mode, onChange }: { mode: EditorMode; onChange: (mode: EditorMode) => void }) => {
    return (
        <Popup.Base>
            <div
                css={css`
                    display: flex;
                    justify-content: center;
                    gap: 4px;
                `}
            >
                <ModeButton aria-pressed={mode === 'select'} onClick={() => onChange('select')}>
                    選択
                </ModeButton>
                <ModeButton aria-pressed={mode === 'rect'} onClick={() => onChange('rect')}>
                    長方形
                </ModeButton>
                <ModeButton aria-pressed={mode === 'line'} onClick={() => onChange('line')}>
                    線
                </ModeButton>
                <ModeButton aria-pressed={mode === 'text'} onClick={() => onChange('text')}>
                    文字
                </ModeButton>
            </div>
        </Popup.Base>
    );
};

const ModeButton = styled(Popup.Button)`
    width: 48px;
    height: 48px;
`;
