import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { EditorMode } from '../model/EditorMode';

export const EditorToolBar = ({ mode, onChange }: { mode: EditorMode; onChange: (mode: EditorMode) => void }) => {
    return (
        <div
            css={css`
                display: flex;
                justify-content: center;
                gap: 4px;
                background: #fff;
                border-radius: 16px;
                padding: 4px;
                border: 1px solid #ccc;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            `}
        >
            <ModeButton aria-pressed={mode === 'select'} onClick={() => onChange('select')}>
                選択
            </ModeButton>
            <ModeButton aria-pressed={mode === 'rect'} onClick={() => onChange('rect')}>
                長方形
            </ModeButton>
        </div>
    );
};

const ModeButton = styled.button`
    width: 48px;
    height: 48px;
    font-size: 12px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 160ms;
    pointer-events: all;
    user-select: none;

    &:hover {
        background: rgba(0, 0, 0, 0.2);
    }

    &[aria-pressed='true'] {
        color: #fff;
        background: #666;
    }
`;
