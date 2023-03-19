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

    export function setScale(prevCamera: Camera, fx: number, fy: number, nextScale: number): Camera {
        const { x: prevX, y: prevY, scale: prevScale } = prevCamera;

        /**
         * 焦点とviewportの左上の画面座標系での距離は変わらない
         * (fx-prevX)*prevScale = (fx-nextX)*nextScale
         * nextScale*nextX = nextScale*fx - prevScale*(fx-prevX)
         *
         * nextX = fx - prevScale/nextScale*(fx-prevX)
         */

        const nextX = fx - (prevScale / nextScale) * (fx - prevX);
        const nextY = fy - (prevScale / nextScale) * (fy - prevY);

        return { scale: nextScale, x: nextX, y: nextY };
    }
}
