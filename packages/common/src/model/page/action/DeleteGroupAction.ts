// import { Patch } from '../../Patch';
// import { ActionDelegate } from './Action';
// import { Page } from '../Page';
//
// export interface DeleteGroupAction {
//     type: 'deleteGroup';
//     id: string;
// }
//
// export function DeleteGroupAction(groupId: string): DeleteGroupAction {
//     return { type: 'deleteGroup', id: groupId };
// }
//
// export const DeleteGroupActionDelegate: ActionDelegate<DeleteGroupAction> = {
//     toPatch(page: Page, action: DeleteGroupAction): Patch<Page> {
//         return {
//             groups: {
//                 [action.id]: undefined,
//             },
//         };
//     },
// };
