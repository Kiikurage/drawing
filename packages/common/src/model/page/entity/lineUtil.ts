import { ModelCordPoint, Point } from '../../Point';

/**
 * Compute the point where L(p11, p12) and L(p21, p22). If lines don't cross, return null
 * @param p11
 * @param p12
 * @param p21
 * @param p22
 */
export function getLineIntersectPoint(
    p11: ModelCordPoint,
    p12: ModelCordPoint,
    p21: ModelCordPoint,
    p22: ModelCordPoint
): ModelCordPoint | null {
    if (!isLineIntersect(p11, p12, p21, p22)) return null;

    const A = (p11.x - p12.x) * (p22.y - p21.y) - (p22.x - p21.x) * (p11.y - p12.y);
    const t = ((p22.y - p21.y) * (p22.x - p12.x) + (p21.x - p22.x) * (p22.y - p12.y)) / A;

    return Point.model(t * p11.x + (1 - t) * p12.x, t * p11.y + (1 - t) * p12.y);
}

// https://qiita.com/kaityo256/items/988bf94bf7b674b8bfdc
export function isLineIntersect(
    p11: ModelCordPoint,
    p12: ModelCordPoint,
    p21: ModelCordPoint,
    p22: ModelCordPoint
): boolean {
    const v11 = (p11.x - p21.x) * (p22.y - p21.y) - (p22.x - p21.x) * (p11.y - p21.y);
    const v12 = (p12.x - p21.x) * (p22.y - p21.y) - (p22.x - p21.x) * (p12.y - p21.y);
    const v21 = (p21.x - p11.x) * (p12.y - p11.y) - (p12.x - p11.x) * (p21.y - p11.y);
    const v22 = (p22.x - p11.x) * (p12.y - p11.y) - (p12.x - p11.x) * (p22.y - p11.y);

    return v11 * v12 < 0 && v21 * v22 < 0;
}
