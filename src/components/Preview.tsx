import { MouseEventHandler, useCallback } from 'react';
import { Camera } from '../model/Camera';
import { Page } from '../model/Page';
import { useEditorController } from './Editor/EditorControllerContext';
import { EntityView } from './EntityView';
import { SVGContainer } from './SVGContainer';

export const Preview = ({ page, camera }: { page: Page; camera: Camera }) => {
    const controller = useEditorController();

    const onMouseDown: MouseEventHandler = useCallback(
        (ev) => {
            const x = ev.clientX / camera.scale + camera.x;
            const y = ev.clientY / camera.scale + camera.y;
            controller.onMouseDown(x, y);
        },
        [camera.scale, camera.x, camera.y, controller]
    );

    return (
        <SVGContainer camera={camera} onMouseDown={onMouseDown}>
            {page.entities.map((entity, i) => (
                <EntityView entity={entity} key={i} />
            ))}
        </SVGContainer>
    );
};
