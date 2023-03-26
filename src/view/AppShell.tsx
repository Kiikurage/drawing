import { css } from '@linaria/core';
import { Outlet } from 'react-router-dom';

export const AppShell = () => {
    return (
        <div
            className={css`
                position: fixed;
                inset: 0;
            `}
        >
            <Outlet />
        </div>
    );
};
