import { ModelCordPoint } from '@drawing/common/src/model/Point';

export interface MYZoomEvent {
    point: ModelCordPoint;
    diff: number;
}
