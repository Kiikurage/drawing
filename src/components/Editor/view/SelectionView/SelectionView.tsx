import { Record } from '../../../../lib/Record';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { Camera } from '../../model/Camera';
import { EntityMap } from '../../model/EntityMap';
import { LineSelectionView } from './LineSelectionView';
import { RectSelectionView } from './RectSelectionView';

export const SelectionView = ({ camera, selectedEntities }: { camera: Camera; selectedEntities: EntityMap }) => {
    if (Record.size(selectedEntities) === 0) return null;

    if (Record.size(selectedEntities) === 1 && Object.values(selectedEntities)[0].type === 'line') {
        return <LineSelectionView entity={Object.values(selectedEntities)[0] as LineEntity} camera={camera} />;
    }

    return <RectSelectionView selectedEntities={selectedEntities} camera={camera} />;
};
