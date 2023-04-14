"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patch = void 0;
var Patch;
(function (Patch) {
    function apply(prevState, patch) {
        const entries = Object.entries(patch);
        if (entries.length === 0)
            return prevState;
        const nextState = { ...prevState };
        let dirty = false;
        for (const [key, nextValue] of entries) {
            const prevValue = prevState[key];
            if (nextValue === undefined) {
                delete nextState[key];
                dirty ||= true;
            }
            else if (nextValue === prevValue) {
                // skip
            }
            else if (prevValue === undefined || prevValue === null) {
                nextState[key] = nextValue;
                dirty ||= true;
            }
            else if (typeof nextValue === 'object' && nextValue !== null && !Array.isArray(nextValue)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const nextSubState = Patch.apply(prevValue, nextValue);
                dirty ||= nextSubState !== prevValue;
                nextState[key] = dirty ? nextSubState : prevValue;
            }
            else {
                nextState[key] = nextValue;
                dirty ||= true;
            }
        }
        return dirty ? nextState : prevState;
    }
    Patch.apply = apply;
    function merge(patch1, patch2) {
        const entries = Object.entries(patch2);
        if (entries.length === 0)
            return patch1;
        const patch = { ...patch1 };
        for (const [key, value2] of entries) {
            const value1 = patch1[key];
            if (value1 === value2) {
                patch[key] = value2;
                continue;
            }
            if (!(key in patch1)) {
                patch[key] = value2;
                continue;
            }
            if (value1 !== undefined &&
                value1 !== null &&
                value2 !== undefined &&
                value2 !== null &&
                typeof value1 === 'object' &&
                typeof value2 === 'object' &&
                !Array.isArray(value1) &&
                !Array.isArray(value2)) {
                patch[key] = merge(value1, value2);
                continue;
            }
            throw new Error('Cannot merge patches');
        }
        return patch;
    }
    Patch.merge = merge;
    function computeInversePatch(prevState, patch) {
        const entries = Object.entries(patch);
        if (entries.length === 0)
            return {};
        const inversePatch = {};
        for (const [key, nextValue] of entries) {
            const prevValue = prevState[key];
            if (nextValue === undefined) {
                inversePatch[key] = prevState[key];
            }
            else if (prevValue === undefined || prevValue === null) {
                inversePatch[key] = undefined;
            }
            else if (typeof nextValue === 'object' && nextValue !== null && !Array.isArray(nextValue)) {
                inversePatch[key] = Patch.computeInversePatch(prevValue, nextValue);
            }
            else {
                inversePatch[key] = prevState[key];
            }
        }
        return inversePatch;
    }
    Patch.computeInversePatch = computeInversePatch;
})(Patch = exports.Patch || (exports.Patch = {}));
//# sourceMappingURL=Patch.js.map