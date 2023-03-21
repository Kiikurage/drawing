import { CRDTMap } from './CRDTMap';

describe('CRDTMap', () => {
    it('test', () => {
        const map1 = new CRDTMap();
        const map2 = new CRDTMap();
        const map3 = new CRDTMap();

        const action1 = map1.set('1', 10);
        map2.apply(action1);
        map3.apply(action1);

        expect(map1.json()).toEqual({ 1: 10 });
        expect(map2.json()).toEqual({ 1: 10 });
        expect(map3.json()).toEqual({ 1: 10 });

        const action2 = map2.set('2', 20);
        map3.apply(action2);
        // map1.apply(action2); まだ伝えない

        expect(map1.json()).toEqual({ 1: 10 });
        expect(map2.json()).toEqual({ 1: 10, 2: 20 });
        expect(map3.json()).toEqual({ 1: 10, 2: 20 });

        const action3 = map3.del('2');
        map1.apply(action3);
        map2.apply(action3);

        expect(map1.json()).toEqual({ 1: 10 });
        expect(map2.json()).toEqual({ 1: 10 });
        expect(map3.json()).toEqual({ 1: 10 });

        map1.apply(action2);

        expect(map1.json()).toEqual({ 1: 10 });
        expect(map2.json()).toEqual({ 1: 10 });
        expect(map3.json()).toEqual({ 1: 10 });
    });

    it('When concurrent update happened, keep add operation', () => {
        const map1 = new CRDTMap();
        const map2 = new CRDTMap();
        const map3 = new CRDTMap();

        const action1 = map1.set('1', 10);
        map2.apply(action1);
        map3.apply(action1);

        expect(map1.json()).toEqual({ 1: 10 });
        expect(map2.json()).toEqual({ 1: 10 });
        expect(map3.json()).toEqual({ 1: 10 });

        const action2 = map2.set('2', 20);
        map3.apply(action2);
        // map1.apply(action2); まだ伝えない

        expect(map1.json()).toEqual({ 1: 10 });
        expect(map2.json()).toEqual({ 1: 10, 2: 20 });
        expect(map3.json()).toEqual({ 1: 10, 2: 20 });

        const action31 = map3.del('2');
        const action32 = map1.set('2', 20);
        map1.apply(action31);
        map2.apply(action31);
        map2.apply(action32);
        map3.apply(action32);

        expect(map1.json()).toEqual({ 1: 10, 2: 20 });
        expect(map2.json()).toEqual({ 1: 10, 2: 20 });
        expect(map3.json()).toEqual({ 1: 10, 2: 20 });

        map1.apply(action2);

        expect(map1.json()).toEqual({ 1: 10, 2: 20 });
        expect(map2.json()).toEqual({ 1: 10, 2: 20 });
        expect(map3.json()).toEqual({ 1: 10, 2: 20 });
    });
});
