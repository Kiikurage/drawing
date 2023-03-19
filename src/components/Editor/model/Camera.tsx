import { ModelCordPoint } from '../../../model/Point';

export interface Camera {
    point: ModelCordPoint;
    scale: number;
}

export module Camera {
    export function create() {
        return {
            point: ModelCordPoint({ x: 0, y: 0 }),
            // [ディスプレイ座標系/モデル座標系]
            scale: 1,
        };
    }

    export function setScale(prevCamera: Camera, point: ModelCordPoint, nextScale: number): Camera {
        const {
            point: { x: prevX, y: prevY },
            scale: prevScale,
        } = prevCamera;

        /**
         * 焦点とviewportの左上の画面座標系での距離は変わらない
         * (fx-prevX)*prevScale = (fx-nextX)*nextScale
         * nextScale*nextX = nextScale*fx - prevScale*(fx-prevX)
         *
         * nextX = fx - prevScale/nextScale*(fx-prevX)
         */

        const nextX = point.x - (prevScale / nextScale) * (point.x - prevX);
        const nextY = point.y - (prevScale / nextScale) * (point.y - prevY);

        return { scale: nextScale, point: ModelCordPoint({ x: nextX, y: nextY }) };
    }
}
