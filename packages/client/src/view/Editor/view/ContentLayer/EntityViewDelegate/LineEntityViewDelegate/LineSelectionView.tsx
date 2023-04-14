import { useEditorViewController } from '../../../EditorControllerContext';
import { CircleHandle } from '../../../SelectionView/Handle';
import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { LineEntity } from '@drawing/common/src/model/page/entity/LineEntity';
import { Box } from '@drawing/common/src/model/Box';

export const LineSelectionView = ({ entity }: { entity: LineEntity }) => {
    const controller = useEditorViewController();
    const { p1, p2 } = entity;

    return (
        <div>
            <SVGContainer viewport={Box.model(p1.x, p1.y, 0, 0)}>
                <CircleHandle
                    cursor="move"
                    x={0}
                    y={0}
                    onPointerDown={(ev) => {
                        ev.stopPropagation();
                        controller.handlePointerDown(ev.nativeEvent, {
                            type: 'singleLineTransformHandle',
                            point: 'p1',
                        });
                    }}
                />
            </SVGContainer>
            <SVGContainer viewport={Box.model(p2.x, p2.y, 0, 0)}>
                <CircleHandle
                    cursor="move"
                    x={0}
                    y={0}
                    onPointerDown={(ev) => {
                        ev.stopPropagation();
                        controller.handlePointerDown(ev.nativeEvent, {
                            type: 'singleLineTransformHandle',
                            point: 'p2',
                        });
                    }}
                />
            </SVGContainer>
        </div>
    );
};
