import { css } from '@linaria/core';
import { Popup } from '../Popup';
import { useEditorViewController } from '../EditorControllerContext';
import { useSelectedEntityIds } from '../../../hooks/useSelection';

export const OrderContextMenuSection = () => {
    const controller = useEditorViewController();
    const entityId = useSelectedEntityIds()[0];

    return (
        <Popup.Section
            className={css`
                display: grid;
                gap: 4px;
            `}
        >
            <Popup.Button onClick={() => controller.pageController.bringToTop(entityId)}>要素を一番手前へ</Popup.Button>
            <Popup.Button onClick={() => controller.pageController.bringForward(entityId)}>
                要素を一つ手前へ
            </Popup.Button>
            <Popup.Button onClick={() => controller.pageController.sendBackward(entityId)}>要素を一つ奥へ</Popup.Button>
            <Popup.Button onClick={() => controller.pageController.sendToBottom(entityId)}>要素を一番奥へ</Popup.Button>
        </Popup.Section>
    );
};
