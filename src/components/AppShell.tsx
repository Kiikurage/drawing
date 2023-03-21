import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

export const AppShell = () => {
    return (
        <div
            css={css`
                position: fixed;
                inset: 0;
            `}
        >
            <Outlet />
        </div>
    );
};
