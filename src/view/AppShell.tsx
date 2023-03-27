import { css } from '@linaria/core';
import { Outlet } from 'react-router-dom';
import { ColorPalette } from './Editor/model/ColorPalette';

export const AppShell = () => {
    const IS_LOCALHOST = location.host.includes('localhost');

    return (
        <div
            className={css`
                position: fixed;
                inset: 0;
                box-sizing: border-box;
            `}
            style={{
                border: `10px solid ${IS_LOCALHOST ? ColorPalette.BLUE.strokeColor : 'transparent'}`,
            }}
        >
            <Outlet />
        </div>
    );
};
