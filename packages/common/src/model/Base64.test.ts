import { Base64 } from './Base64';
import { Bit } from './Bit';

describe('Base64', () => {
    test.each(
        new Array(100).fill(0).map(() => {
            const byteLen = Math.floor(Math.random() * 10) + 5;
            const buffer = new Uint8Array(byteLen);

            for (let i = 0; i < byteLen * 8; i++) {
                Bit.set(buffer, i, Math.random() > 0.5 ? 1 : 0);
            }

            return [buffer];
        })
    )('%p', (buffer) => {
        expect(Base64.decode(Base64.encode(buffer))).toEqual(buffer);
    });
});
