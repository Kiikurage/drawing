import { css } from '@linaria/core';
import { useExtension } from '../../core/view/EditorControllerContext';
import { Popup } from '../../core/view/Popup';
import { useSlice } from '../../../hooks/useStore';
import { distinct, LineEntity } from '@drawing/common';
import { LineExtension } from './LineExtension';
import { SelectExtension } from '../select/SelectExtension';

export const ArrowHeadContextMenuSection = () => {
    const selectExtension = useExtension(SelectExtension);
    const { arrowHeadType1, arrowHeadType2 } = useSlice(selectExtension.store, (state) => {
        const lines = Object.values(state.entities) as LineEntity[];

        const arrowHeadTypes1 = lines.map((line) => line.arrowHeadType1).reduce(distinct(), []);
        const arrowHeadType1 = arrowHeadTypes1.length === 1 ? arrowHeadTypes1[0] ?? 'none' : 'none';

        const arrowHeadTypes2 = lines.map((line) => line.arrowHeadType2).reduce(distinct(), []);
        const arrowHeadType2 = arrowHeadTypes2.length === 1 ? arrowHeadTypes2[0] ?? 'none' : 'none';

        return { arrowHeadType1, arrowHeadType2 };
    });

    const lineExtension = useExtension(LineExtension);

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
                    lineExtension.setArrowHeadTypeForSelectedEntities(
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
                    lineExtension.setArrowHeadTypeForSelectedEntities(
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
