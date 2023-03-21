import { CRDTSet } from './CRDTSet';

describe('CRDTSet', () => {
    it('test', () => {
        const set1 = new CRDTSet();
        const set2 = new CRDTSet();
        const set3 = new CRDTSet();

        const action1 = set1.add(1);
        set2.apply(action1);
        set3.apply(action1);

        expect(set1.values().sort()).toEqual([1]);
        expect(set2.values().sort()).toEqual([1]);
        expect(set3.values().sort()).toEqual([1]);

        const action2 = set2.add(2);
        set3.apply(action2);
        // set1.apply(action2); まだ伝えない

        expect(set1.values().sort()).toEqual([1]);
        expect(set2.values().sort()).toEqual([1, 2]);
        expect(set3.values().sort()).toEqual([1, 2]);

        const action3 = set3.del(2);
        set1.apply(action3);
        set2.apply(action3);

        expect(set1.values().sort()).toEqual([1]);
        expect(set2.values().sort()).toEqual([1]);
        expect(set3.values().sort()).toEqual([1]);

        set1.apply(action2);

        expect(set1.values().sort()).toEqual([1]);
        expect(set2.values().sort()).toEqual([1]);
        expect(set3.values().sort()).toEqual([1]);
    });

    it('When concurrent update happened, keep add operation', () => {
        const set1 = new CRDTSet();
        const set2 = new CRDTSet();
        const set3 = new CRDTSet();

        const action1 = set1.add(1);
        set2.apply(action1);
        set3.apply(action1);

        expect(set1.values().sort()).toEqual([1]);
        expect(set2.values().sort()).toEqual([1]);
        expect(set3.values().sort()).toEqual([1]);

        const action2 = set2.add(2);
        set3.apply(action2);
        // set1.apply(action2); まだ伝えない

        expect(set1.values().sort()).toEqual([1]);
        expect(set2.values().sort()).toEqual([1, 2]);
        expect(set3.values().sort()).toEqual([1, 2]);

        const action31 = set3.del(2);
        const action32 = set1.add(2);
        set1.apply(action31);
        set2.apply(action31);
        set2.apply(action32);
        set3.apply(action32);

        expect(set1.values().sort()).toEqual([1, 2]);
        expect(set2.values().sort()).toEqual([1, 2]);
        expect(set3.values().sort()).toEqual([1, 2]);

        set1.apply(action2);

        expect(set1.values().sort()).toEqual([1, 2]);
        expect(set2.values().sort()).toEqual([1, 2]);
        expect(set3.values().sort()).toEqual([1, 2]);
    });
});
