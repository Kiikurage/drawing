// import { Patch } from '../../Patch';
// import { ActionDelegate } from './Action';
// import { Page } from '../Page';
//
// export interface UpdateGroupAction {
//     type: 'updateGroup';
//     groupId: string;
//     addedChildren: string[];
//     removedChildren: string[];
// }
//
// export function UpdateGroupAction(
//     groupId: string,
//     addedChildren: string[],
//     removedChildren: string[]
// ): UpdateGroupAction {
//     return { type: 'updateGroup', groupId, addedChildren, removedChildren };
// }
//
// export const UpdateGroupActionDelegate: ActionDelegate<UpdateGroupAction> = {
//     toPatch(page: Page, action: UpdateGroupAction): Patch<Page> {
//         const group = page.groups[action.groupId];
//         if (group === undefined) {
//             return {};
//         }
//
//         const addedChildren = action.addedChildren.filter((id) => page.entities[id] !== undefined);
//         const removedChildren = action.removedChildren.filter((id) => page.entities[id] !== undefined);
//
//         const newChildren = new Set(group.children);
//         for (const id of addedChildren) newChildren.add(id);
//         for (const id of removedChildren) newChildren.delete(id);
//
//         return {
//             groups: {
//                 [group.id]: {
//                     children: Array.from(newChildren),
//                 },
//             },
//         };
//     },
// };
