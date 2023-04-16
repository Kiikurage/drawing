import { Page } from '../Page';
import { PolygonEntity } from '../entity/PolygonEntity';
import { Point } from '../../Point';
import { Size } from '../../Size';
import { UpdateEntitiesAction, UpdateEntitiesActionDelegate } from './UpdateEntitiesAction';

describe('UpdateEntitiesAction', () => {
    describe('computeInverse', () => {
        it('', () => {
            const entity = PolygonEntity.create({
                p1: Point.model(100, 200),
                size: Size.model(300, 400),
            });
            const page = Page.create({
                entities: { [entity.id]: entity },
            });

            const action = UpdateEntitiesAction({
                [entity.id]: {
                    p1: Point.model(150, 250),
                    size: Size.model(350, 450),
                },
            });
            const inverseAction = UpdateEntitiesActionDelegate.computeInverse(page, action);

            expect(inverseAction).toEqual({
                type: 'updateEntities',
                patch: {
                    [entity.id]: {
                        p1: { x: 100, y: 200 },
                        size: { width: 300, height: 400 },
                    },
                },
            });
        });
    });
});
