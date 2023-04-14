"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const AddEntitiesAction_1 = require("./AddEntitiesAction");
const DeleteEntitiesAction_1 = require("./DeleteEntitiesAction");
const UpdateEntitiesAction_1 = require("./UpdateEntitiesAction");
// | AddGroupAction
// | DeleteGroupAction
// | UpdateGroupAction;
var Action;
(function (Action) {
    const delegates = {
        addEntities: AddEntitiesAction_1.AddEntitiesActionDelegate,
        updateEntities: UpdateEntitiesAction_1.UpdateEntitiesActionDelegate,
        deleteEntities: DeleteEntitiesAction_1.DeleteEntitiesActionDelegate,
        // addGroup: AddGroupActionDelegate,
        // deleteGroup: DeleteGroupActionDelegate,
        // updateGroup: UpdateGroupActionDelegate,
    };
    function getDelegate(action) {
        return delegates[action.type];
    }
    function toPatch(page, action) {
        return getDelegate(action).toPatch(page, action);
    }
    Action.toPatch = toPatch;
})(Action = exports.Action || (exports.Action = {}));
//# sourceMappingURL=Action.js.map