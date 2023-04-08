import { CRDTLivePage, CRDTLivePageWithTestVisibility } from './CRDTLivePage';
import { LineEntity, Patch, Point, RectEntity } from '@drawing/common';

describe('CRDTPage', () => {
    it('Add and delete entities with no concurrent updates', () => {
        const page1 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page2 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page3 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const entity1 = RectEntity.create();
        const entity2 = LineEntity.create();

        const action1 = page1.add(entity1);
        page2.apply(action1);
        page3.apply(action1);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });

        const action2 = page2.add(entity2);
        page3.apply(action2);
        // page1.apply(action2); まだ伝えない

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1, [entity2.id]: entity2 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1, [entity2.id]: entity2 });

        const action3 = page3.delete(entity2.id);
        page1.apply(action3);
        page2.apply(action3);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });

        page1.apply(action2);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });
    });

    it('Add and delete entities with concurrent updates', () => {
        const page1 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page2 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page3 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const entity1 = RectEntity.create();
        const entity2 = LineEntity.create();

        const action1 = page1.add(entity1);
        page2.apply(action1);
        page3.apply(action1);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });

        const action2 = page2.add(entity2);
        page3.apply(action2);
        // page1.apply(action2); まだ伝えない

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1, [entity2.id]: entity2 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1, [entity2.id]: entity2 });

        const action31 = page3.delete(entity2.id);
        const action32 = page1.add(entity2);
        expect(page1.entities).toEqual({ [entity1.id]: entity1, [entity2.id]: entity2 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1, [entity2.id]: entity2 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });

        page1.apply(action31);
        page2.apply(action31);
        page2.apply(action32);
        page3.apply(action32);

        // Delete must be prioritized
        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });

        page1.apply(action2);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });
    });

    it('Deleted entity can be re-added by user who deleted it', () => {
        const page1 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page2 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const entity1 = RectEntity.create();

        const action1 = page1.add(entity1); // page1=[1, 0], page2=[0, 0], action1=[1, 0]
        page2.apply(action1); // page1=[1, 0], page2=[1, 1]

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });

        const action2 = page2.delete(entity1.id); // page1=[1, 0], page2=[1, 2], action2=[1, 2]
        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({});

        const action3 = page2.add(entity1); // page1=[1, 0], page2=[1, 3], action3=[1, 3]
        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });

        page1.apply(action2); // page1=[2, 2], page2=[1, 3]
        page1.apply(action3);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
    });

    it('Transform and style update must be accepted independently', () => {
        const page1 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page2 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page3 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const entity1 = RectEntity.create();

        const action1 = page1.add(entity1);
        page2.apply(action1);
        page3.apply(action1);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });

        const patch1: Patch<RectEntity> = { p1: Point.model(2, 3) };
        const patch2: Patch<RectEntity> = { palette: 'RED' };

        const action21 = page2.update(entity1.id, 'transform', patch1);
        const action22 = page3.update(entity1.id, 'style', patch2);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: Patch.apply(entity1, patch1) });
        expect(page3.entities).toEqual({ [entity1.id]: Patch.apply(entity1, patch2) });

        page1.apply(action21);
        page3.apply(action21);
        page1.apply(action22);
        page2.apply(action22);

        expect(page1.entities).toEqual({ [entity1.id]: Patch.apply(Patch.apply(entity1, patch1), patch2) });
        expect(page2.entities).toEqual({ [entity1.id]: Patch.apply(Patch.apply(entity1, patch1), patch2) });
        expect(page3.entities).toEqual({ [entity1.id]: Patch.apply(Patch.apply(entity1, patch1), patch2) });
    });

    it('Delete action must be prioritized than transform or style update', () => {
        const page1 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page2 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const page3 = new CRDTLivePage() as unknown as CRDTLivePageWithTestVisibility;
        const entity1 = RectEntity.create();

        const action1 = page1.add(entity1);
        page2.apply(action1);
        page3.apply(action1);

        expect(page1.entities).toEqual({ [entity1.id]: entity1 });
        expect(page2.entities).toEqual({ [entity1.id]: entity1 });
        expect(page3.entities).toEqual({ [entity1.id]: entity1 });

        const patch1: Patch<RectEntity> = { p1: Point.model(2, 3) };
        const patch2: Patch<RectEntity> = { palette: 'RED' };

        const action21 = page1.delete(entity1.id);
        const action22 = page2.update(entity1.id, 'transform', patch1);
        const action23 = page3.update(entity1.id, 'style', patch2);

        expect(page1.entities).toEqual({});
        expect(page2.entities).toEqual({ [entity1.id]: Patch.apply(entity1, patch1) });
        expect(page3.entities).toEqual({ [entity1.id]: Patch.apply(entity1, patch2) });

        page1.apply(action23);
        page2.apply(action23);
        page1.apply(action22);
        page3.apply(action22);
        page2.apply(action21);
        page3.apply(action21);

        expect(page1.entities).toEqual({});
        expect(page2.entities).toEqual({});
        expect(page3.entities).toEqual({});
    });
});
