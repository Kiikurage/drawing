import { Entity } from '../../../model/entity/Entity';
import { Camera } from '../model/Camera';
import { LineSelectionView } from './LineSelectionView';
import { RectSelectionView } from './RectSelectionView';

export const SelectionView = ({ camera, selectedEntities }: { camera: Camera; selectedEntities: Entity[] }) => {
    if (selectedEntities.length === 0) return null;

    if (selectedEntities.length === 1 && selectedEntities[0].type === 'line') {
        return <LineSelectionView entity={selectedEntities[0]} camera={camera} />;
    }

    return <RectSelectionView selectedEntities={selectedEntities} camera={camera} />;
};
