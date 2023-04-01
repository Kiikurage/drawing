import { styled } from '@linaria/react';
import { COLOR_SELECTION } from '../../styles';

export module Popup {
    export const Base = styled.div`
        background: #fff;
        border-radius: 16px;
        padding: 0 4px;
        border: 1px solid #ccc;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    `;

    export const Button = styled.button`
        min-height: 36px;
        font-size: 12px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: none;
        border: none;
        cursor: pointer;
        transition: background-color 160ms;
        pointer-events: all;

        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        &[aria-pressed='true'] {
            color: #fff;
            background: ${COLOR_SELECTION};
        }
    `;

    export const Section = styled.div`
        padding: 4px 0;

        & + & {
            border-top: 1px solid #ccc;
        }
    `;
}
