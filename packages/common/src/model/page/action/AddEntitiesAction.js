"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEntitiesActionDelegate = exports.AddEntitiesAction = void 0;
const Record_1 = require("../../Record");
function AddEntitiesAction(entities) {
    return { type: 'addEntities', entities };
}
exports.AddEntitiesAction = AddEntitiesAction;
exports.AddEntitiesActionDelegate = {
    toPatch(page, action) {
        return {
            entities: Record_1.Record.mapToRecord(action.entities, (entity) => [entity.id, entity]),
        };
    },
};
//# sourceMappingURL=AddEntitiesAction.js.map