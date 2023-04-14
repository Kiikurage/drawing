// import { css } from '@linaria/core';
// import { useEditorViewController } from '../EditorControllerContext';
// import { Popup } from '../Popup';
// import { useSelectedEntityIds } from '../../../hooks/useSelection';
//
// export const GroupContextMenuSection = () => {
//     const selectedIds = useSelectedEntityIds();
//     const pageController = useEditorViewController().pageController;
//
//     return (
//         <Popup.Section
//             className={css`
//                 display: grid;
//                 gap: 4px;
//             `}
//         >
//             <Popup.Button onClick={() => pageController.createNewGroup(selectedIds)}>Group</Popup.Button>
//         </Popup.Section>
//     );
// };
