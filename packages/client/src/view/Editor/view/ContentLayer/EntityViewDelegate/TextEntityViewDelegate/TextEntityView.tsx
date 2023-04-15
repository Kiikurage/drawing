import { SVGContainer } from '../../../CameraLayer/SVGContainer';
import { EditableEntityText } from '../../EditableEntityText';
import { TextEntity } from '@drawing/common/src/model/page/entity/TextEntity';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { useEditorViewController } from '@drawing/client/src/view/Editor/view/EditorControllerContext';

export const TextEntityView = ({ entity }: { entity: TextEntity }) => {
    const controller = useEditorViewController();

    return (
        <SVGContainer
            viewport={Entity.getBoundingBox(entity)}
            html={
                <EditableEntityText
                    entity={entity}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        controller.pageController.updateEntities({
                            [entity.id]: {
                                size: {
                                    width: contentWidth,
                                    height: contentHeight,
                                },
                            },
                        });
                    }}
                />
            }
        />
    );
};
