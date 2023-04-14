"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEntitiesActionDelegate = exports.DeleteEntitiesAction = void 0;
const Patch_1 = require("../../Patch");
function DeleteEntitiesAction(entityIds) {
    return { type: 'deleteEntities', entityIds };
}
exports.DeleteEntitiesAction = DeleteEntitiesAction;
exports.DeleteEntitiesActionDelegate = {
    toPatch(page, action) {
        let patch = {};
        for (const entityId of action.entityIds) {
            patch = Patch_1.Patch.merge(patch, {
                entities: {
                    [entityId]: undefined,
                },
            });
        }
        return patch;
    },
};
//# sourceMappingURL=DeleteEntitiesAction.js.map