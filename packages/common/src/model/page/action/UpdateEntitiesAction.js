"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEntitiesActionDelegate = exports.UpdateEntitiesAction = void 0;
function UpdateEntitiesAction(patch) {
    return { type: 'updateEntities', patch };
}
exports.UpdateEntitiesAction = UpdateEntitiesAction;
exports.UpdateEntitiesActionDelegate = {
    toPatch(page, action) {
        const patch = {};
        for (const [entityId, subPatch] of Object.entries(action.patch)) {
            if (!(entityId in page.entities))
                continue;
            patch[entityId] = subPatch;
        }
        return { entities: patch };
    },
};
//# sourceMappingURL=UpdateEntitiesAction.js.map