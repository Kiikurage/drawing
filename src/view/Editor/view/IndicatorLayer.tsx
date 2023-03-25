import { css } from '@emotion/react';
import { memo, useMemo } from 'react';
import { Record } from '../../../lib/Record';
import { useSlice } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { SelectingRangeView } from './SelectingRangeView';
import { SelectionView } from './SelectionView/SelectionView';
import { SnapGuide } from './SnapGuide';

export const IndicatorLayer = memo(() => {
    const controller = useEditorController();
    const { page, camera, selectMode, textEditMode } = useSlice(controller.store, (state) => ({
        page: state.page,
        camera: state.camera,
        selectMode: state.selectMode,
        textEditMode: state.textEditMode,
    }));
    const selectedEntities = useMemo(
        () => Record.mapToRecord(selectMode.selectedEntityIds, (id) => [id, page.entities[id]]),
        [page.entities, selectMode.selectedEntityIds]
    );

    return (
        <div
            css={css`
                position: absolute;
                inset: 0;
            `}
        >
            {!textEditMode.editing && <SelectionView selectedEntities={selectedEntities} camera={camera} />}
            <SelectingRangeView />
            <SnapGuide />
        </div>
    );
});
