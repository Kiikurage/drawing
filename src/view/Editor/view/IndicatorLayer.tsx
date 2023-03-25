import { css } from '@emotion/react';
import { memo, useMemo } from 'react';
import { Record } from '../../../lib/Record';
import { useSlice } from '../../hooks/useStore';
import { useEditorController } from '../EditorControllerContext';
import { computeVisibleEntities } from '../util';
import { EntityBoundingBoxView } from './BoundingBoxView/EntityBoundingBoxView';
import { ContextMenuPopup } from './ContextMenuPopup';
import { HoveredEntityBoundingBox } from './HoveredEntityBoundingBox';
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
    const visibleSelectedEntities = useMemo(
        () => computeVisibleEntities(selectedEntities, camera),
        [camera, selectedEntities]
    );

    return (
        <div
            css={css`
                position: absolute;
                inset: 0;
            `}
        >
            <svg
                css={css`
                    position: absolute;
                    top: 0;
                    left: 0;
                `}
                width="100%"
                height="100%"
            >
                {Object.values(visibleSelectedEntities).map((entity) => (
                    <EntityBoundingBoxView entity={entity} camera={camera} key={entity.id} />
                ))}
                <HoveredEntityBoundingBox />
                {!textEditMode.editing && <SelectionView selectedEntities={selectedEntities} camera={camera} />}
                <SelectingRangeView />
                <SnapGuide />
            </svg>
            <ContextMenuPopup />
        </div>
    );
});
