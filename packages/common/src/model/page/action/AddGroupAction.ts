// import { Patch } from '../../Patch';
// import { ActionDelegate } from './Action';
// import { Page } from '../Page';
// import { randomId } from '../../../lib/randomId';
//
// export interface AddGroupAction {
//     type: 'addGroup';
//     groupId: string;
//     children: string[];
// }
//
// export function AddGroupAction(children: string[]): AddGroupAction {
//     return { type: 'addGroup', groupId: randomId(), children };
// }
//
// export const AddGroupActionDelegate: ActionDelegate<AddGroupAction> = {
//     toPatch(page: Page, action: AddGroupAction): Patch<Page> {
//         const children = action.children.filter((id) => page.entities[id] !== undefined);
//
//         let patch: Patch<Page> = {};
//
//         for (const childId of children) {
//             patch = Patch.merge(patch, {
//                 entities: {
//                     [childId]: {
//                         groupId: action.groupId,
//                     },
//                 },
//             });
//         }
//
//         patch.layouts = page.layouts.filter((id) => !children.includes(id));
//         patch.layouts.push(action.groupId);
//
//         patch.groups = { [action.groupId]: { children } };
//
//         return patch;
//     },
// };
