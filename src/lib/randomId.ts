const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

export function randomId() {
    return 'xxxxxxxx'.replace(/x/g, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
}
