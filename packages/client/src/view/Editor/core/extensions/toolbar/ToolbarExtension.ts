import { Extension } from '../../controller/Extension';
import { ToolbarState } from './ToolbarState';
import { Store } from '@drawing/common';
import { ToolbarItem } from './ToolbarItem';

export class ToolbarExtension extends Extension {
    readonly store = new Store(ToolbarState.create());

    addItem(item: ToolbarItem) {
        this.store.setState({
            items: [...this.store.state.items, item],
        });
    }
}
