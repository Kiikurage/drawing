import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { memo } from 'react';
import { Popup } from '../Popup';
import { useEditorViewController } from '../EditorControllerContext';
import { useSlice } from '../../../hooks/useSlice';
import { PolygonController } from '../../../../EditorCore/PolygonController/PolygonController';
import { LineController } from '../../../../EditorCore/LineController/LineController';
import { TextController } from '../../../../EditorCore/TextController/TextController';
import { SelectionController } from '../../../../EditorCore/selection/SelectionController';

export const Toolbar = memo(() => {
    const controller = useEditorViewController();
    const { mode } = useSlice(controller.modeController.store, (state) => ({ mode: state.mode }));

    return (
        <div
            onPointerDown={(ev) => ev.stopPropagation()}
            onDoubleClick={(ev) => ev.stopPropagation()}
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
                    <ToolbarButton
                        aria-pressed={mode === SelectionController.ModeName}
                        onClick={() => controller.modeController.setMode(SelectionController.ModeName)}
                    >
                        選択
                    </ToolbarButton>
                    <ToolbarButton
                        aria-pressed={mode === PolygonController.ModeName}
                        onClick={() => controller.modeController.setMode(PolygonController.ModeName)}
                    >
                        長方形
                    </ToolbarButton>
                    <ToolbarButton
                        aria-pressed={mode === LineController.ModeName}
                        onClick={() => controller.modeController.setMode(LineController.ModeName)}
                    >
                        線
                    </ToolbarButton>
                    <ToolbarButton
                        aria-pressed={mode === TextController.ModeName}
                        onClick={() => controller.modeController.setMode(TextController.ModeName)}
                    >
                        文字
                    </ToolbarButton>
                </Popup.Section>
            </Popup.Base>
        </div>
    );
});
export const ToolbarButton = styled(Popup.Button)`
    width: 48px;
    height: 48px;
    justify-content: center;
`;
