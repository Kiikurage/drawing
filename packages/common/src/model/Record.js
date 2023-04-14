"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
var Record;
(function (Record) {
    function map(record, fn) {
        return Object.fromEntries(Object.entries(record).map(([k1, v1]) => fn(k1, v1)));
    }
    Record.map = map;
    function mapToRecord(array, fn) {
        return Object.fromEntries(array.map(fn));
    }
    Record.mapToRecord = mapToRecord;
    function mapValue(record, fn) {
        const entries = Object.entries(record).map(([k, v1]) => [k, fn(v1, k)]);
        return Object.fromEntries(entries);
    }
    Record.mapValue = mapValue;
    function filter(record, fn) {
        return Object.fromEntries(Object.entries(record).filter(([k, v]) => fn(v, k)));
    }
    Record.filter = filter;
    function size(record) {
        return Object.keys(record).length;
    }
    Record.size = size;
})(Record = exports.Record || (exports.Record = {}));
//# sourceMappingURL=Record.js.map