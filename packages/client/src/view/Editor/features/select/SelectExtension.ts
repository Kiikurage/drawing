import { IEditorController, MouseEventButton, MouseEventInfo } from '../../core/controller/IEditorController';
import { Extension } from '../../core/controller/Extension';
import { TransformExtension } from '../transform/TransformExtension';
import { Entity, EntityMap, EventDispatcher, Patch, Store, TransformType } from '@drawing/common';
import { ModeExtension } from '../mode/ModeExtension';
import { ModeChangeEvent } from '../mode/ModeChangeEvent';
import { SelectState } from './SelectState';

export class SelectExtension extends Extension {
    static readonly MODE_KEY = 'select';
    readonly store = new Store(SelectState.create());
    private transformExtension: TransformExtension = null as never;

    get selectedEntityMap(): EntityMap {
        return this.store.state.entities;
    }

    get selectedEntityIds(): string[] {
        return Object.keys(this.selectedEntityMap);
    }

    get selectedEntities(): Entity[] {
        return Object.values(this.selectedEntityMap);
    }

    onRegister(controller: IEditorController) {
        super.onRegister(controller);

        this.transformExtension = this.controller.requireExtension(TransformExtension);

        const modeExtension = this.controller.requireExtension(ModeExtension);
        modeExtension.onModeChange.addListener(this.onModeChange);
        this.updateModeSpecificListener(modeExtension.mode);

        controller.shortcuts
            .addPatternListener(['V'], () => {
                modeExtension.setMode(SelectExtension.MODE_KEY);
            })
            .addPatternListener(['Control', 'A'], (ev) => {
                ev.preventDefault();
                this.selectAll();
            })
            .addPatternListener(['Delete'], (ev) => {
                ev.preventDefault();
                this.deleteSelectedEntities();
            })
            .addPatternListener(['Backspace'], (ev) => {
                ev.preventDefault();
                this.deleteSelectedEntities();
            });

        controller.store.addListener((state) => {
            const patch: Patch<EntityMap> = {};
            for (const entityId of this.selectedEntityIds) {
                patch[entityId] = state.page.entities[entityId];
            }
            this.store.setState({ entities: patch });
        });
    }

    deleteSelectedEntities() {
        this.controller.deleteEntities(this.selectedEntityIds);
    }

    setSelection(entityIds: string[]) {
        const prevEntityIds = this.selectedEntityIds;
        const nextEntityIds = entityIds.filter((entityId) => entityId in this.controller.state.page.entities);

        this.onSelectionChange({ prevEntityIds, nextEntityIds });

        const patch: Patch<EntityMap> = {};
        for (const entityId of prevEntityIds) {
            patch[entityId] = undefined;
        }
        for (const entityId of nextEntityIds) {
            patch[entityId] = this.controller.store.state.page.entities[entityId];
        }
        this.store.setState({ entities: patch });
    }

    addSelection(entityId: string) {
        this.setSelection([...this.selectedEntityIds, entityId]);
    }

    selectAll() {
        this.setSelection(Object.keys(this.controller.state.page.entities));
    }

    clearSelection() {
        this.setSelection([]);
    }

    readonly onSelectionChange = EventDispatcher<SelectionChangeEventInfo, [SelectionChangeEventInfo]>((ev) => ev);

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
        if (ev.nextMode !== SelectExtension.MODE_KEY) {
            this.clearSelection();
        }
    };

    private updateModeSpecificListener(mode: string) {
        if (mode === SelectExtension.MODE_KEY) {
            this.controller.onMouseDown.addListener(this.onMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        const { hover } = this.controller.state;

        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                switch (hover.type) {
                    case 'entity': {
                        if (ev.shiftKey) {
                            this.addSelection(hover.entityId);
                        } else {
                            this.setSelection([hover.entityId]);
                        }
                        this.transformExtension.startTransform(
                            ev.point,
                            this.store.state.entities,
                            TransformType.TRANSLATE
                        );
                        return;
                    }

                    case 'transformHandle': {
                        this.transformExtension.startTransform(
                            ev.point,
                            this.store.state.entities,
                            hover.transformType
                        );
                        return;
                    }
                }
                return;
            }
        }
    };
}

export interface SelectionChangeEventInfo {
    prevEntityIds: string[];
    nextEntityIds: string[];
}
