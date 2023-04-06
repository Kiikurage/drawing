import { SharedArray } from './SharedArray';
import { sleep } from '@drawing/common';
import { MockServer } from './MockServer';

describe('SharedArray', () => {
    describe('single', () => {
        it('push', () => {
            const array = new SharedArray();
            array.push(1);
            array.push(2);
            array.push(3);

            expect(array.values).toEqual([1, 2, 3]);
        });

        it('pop', () => {
            const array = new SharedArray();
            array.push(1);
            array.push(2);
            array.push(3);

            expect(array.pop()).toBe(3);
            expect(array.pop()).toBe(2);
            expect(array.pop()).toBe(1);
            expect(array.pop()).toBe(undefined);
        });

        it('pop from empty list', () => {
            const array = new SharedArray();

            expect(array.pop()).toBe(undefined);
            expect(array.pop()).toBe(undefined);
            expect(array.pop()).toBe(undefined);
            expect(array.pop()).toBe(undefined);
        });
    });

    it('concurrent edit should convergent to the same state eventually', async () => {
        const server = new MockServer();

        const array1 = new SharedArray();
        const array2 = new SharedArray();
        const array3 = new SharedArray();
        server.client(10).connect(array1);
        server.client(10).connect(array2);
        server.client(10).connect(array3);

        for (let i = 0; i < 100; i++) {
            const array = [array1, array2, array3].at(Math.floor(Math.random() * 3)) ?? array1;
            const action = ['PUSH', 'POP'].at(Math.floor(Math.random() * 2)) ?? 'PUSH';

            switch (action) {
                case 'POP':
                    array.pop();
                    break;

                case 'PUSH':
                    array.push(Math.random());
                    break;
            }

            await sleep(Math.floor(Math.random() * 10));
        }
        await server.waitForSync();

        expect(array1.values).toEqual(array2.values);
        expect(array1.values).toEqual(array3.values);
        expect(array2.values).toEqual(array3.values);
    });
});
