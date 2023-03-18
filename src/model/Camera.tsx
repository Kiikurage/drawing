export interface Camera {
    x: number;
    y: number;
    scale: number;
}

export module Camera {
    export function create() {
        return {
            x: 0,
            y: 0,
            // [ディスプレイ座標系/モデル座標系]
            scale: 1,
        };
    }

    export function setScale(oldCamera: Camera, fx: number, fy: number, newScale: number): Camera {
        const { x: oldX, y: oldY, scale: oldScale } = oldCamera;

        /**
         * 焦点とviewportの左上の画面座標系での距離は変わらない
         * (fx-oldX)*oldScale = (fx-newX)*newScale
         * newScale*newX = newScale*fx - oldScale*(fx-oldX)
         *
         * newX = fx - oldScale/newScale*(fx-oldX)
         */

        const newX = fx - (oldScale / newScale) * (fx - oldX);
        const newY = fy - (oldScale / newScale) * (fy - oldY);

        return { scale: newScale, x: newX, y: newY };
    }
}
