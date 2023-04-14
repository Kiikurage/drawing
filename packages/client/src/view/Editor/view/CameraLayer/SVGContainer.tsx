import { ReactNode } from 'react';
import { css } from '@linaria/core';
import { ModelCordBox } from '@drawing/common/src/model/Box';

const PADDING = 100;

export const SVGContainer = ({
    viewport,
    children,
    html,
}: {
    viewport: ModelCordBox;
    children?: ReactNode;
    html?: ReactNode;
}) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: viewport.point.x,
                top: viewport.point.y,
                width: viewport.size.width,
                height: viewport.size.height,
            }}
        >
            {children && (
                <svg
                    className={css`
                        position: absolute;
                        inset: -${PADDING}px;
                        width: calc(100% + ${PADDING * 2}px);
                        height: calc(100% + ${PADDING * 2}px);
                    `}
                >
                    <g transform={`translate(${PADDING} ${PADDING})`}>{children}</g>
                </svg>
            )}
            {html && (
                <div
                    className={css`
                        position: absolute;
                        inset: 0;
                    `}
                >
                    {html}
                </div>
            )}
        </div>
    );
};
