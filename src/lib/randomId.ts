const CHARS64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';

export function randomId() {
    // UUID = 128bit = (2^8)^16
    return 'xxxxxxxxxxxxxxxx'.replace(/x/g, () => CHARS64[Math.floor(Math.random() * 64)]);
}
