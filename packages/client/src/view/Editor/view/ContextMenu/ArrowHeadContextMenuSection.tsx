import { css } from '@linaria/core';
import { useEditorViewController } from '../EditorControllerContext';
import { Popup } from '../Popup';
import { useSelectedEntities } from '../../../hooks/useSelection';
import { useMemo } from 'react';
import { LineEntity } from '@drawing/common/src/model/page/entity/LineEntity';
import { distinct } from '@drawing/common/src/lib/distinct';

export const ArrowHeadContextMenuSection = () => {
    const controller = useEditorViewController();
    const lines = useSelectedEntities() as LineEntity[];
    const { arrowHeadType1, arrowHeadType2 } = useMemo(() => {
        const arrowHeadTypes1 = lines.map((line) => line.arrowHeadType1).reduce(distinct(), []);
        const arrowHeadType1 = arrowHeadTypes1.length === 1 ? arrowHeadTypes1[0] ?? 'none' : 'none';

        const arrowHeadTypes2 = lines.map((line) => line.arrowHeadType2).reduce(distinct(), []);
        const arrowHeadType2 = arrowHeadTypes2.length === 1 ? arrowHeadTypes2[0] ?? 'none' : 'none';

        return { arrowHeadType1, arrowHeadType2 };
    }, [lines]);

    return (
        <Popup.Section
            className={css`
                display: grid;
                grid-template-columns: auto auto;
                justify-content: center;
                gap: 4px;
            `}
        >
            <Popup.IconButton
                onClick={() =>
                    controller.lineController.setArrowHeadTypeForSelectedEntities(
                        'p1',
                        arrowHeadType1 === 'none' ? 'arrow' : 'none'
                    )
                }
            >
                <span className="material-symbols-outlined">
                    {arrowHeadType1 === 'arrow' ? 'arrow_back' : 'horizontal_rule'}
                </span>
            </Popup.IconButton>
            <Popup.IconButton
                onClick={() =>
                    controller.lineController.setArrowHeadTypeForSelectedEntities(
                        'p2',
                        arrowHeadType2 === 'none' ? 'arrow' : 'none'
                    )
                }
            >
                <span className="material-symbols-outlined">
                    {arrowHeadType2 === 'arrow' ? 'arrow_forward' : 'horizontal_rule'}
                </span>
            </Popup.IconButton>
        </Popup.Section>
    );
};
