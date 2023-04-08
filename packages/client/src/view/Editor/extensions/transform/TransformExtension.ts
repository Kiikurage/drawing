import {
    Entity,
    EntityMap,
    EventDispatcher,
    LineEntity,
    ModelCordBox,
    ModelCordPoint,
    Patch,
    Record,
    snapBox,
    Transform,
    TransformType,
} from '@drawing/common';
import { Extension } from '../../core/controller/Extension';
import { IEditorController, MouseEventInfo } from '../../core/controller/IEditorController';
import { PageEditSession } from '../../core/controller/PageEditSession';
import { SnapExtension } from '../snap/SnapExtension';

export class TransformExtension extends Extension {
    private startPoint: ModelCordPoint | null = null;
    private entities: EntityMap | null = null;
    private startBox: ModelCordBox | null = null;
    private transformType: TransformType | null = null;
    public linkedLines: Record<string, LineEntity[]> = {}; // (Rect ID, linked Line[])
    private session: PageEditSession | null = null;
    private autoCommit = false;
    private snapExtension: SnapExtension = null as never;
    private constrainEnabled = false;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);
        controller.onMouseMove.addListener(this.onMouseMove);
        controller.onMouseUp.addListener(this.onMouseUp);
        this.snapExtension = controller.requireExtension(SnapExtension);
        controller.keyboard
            .addKeyDownListener((ev) => {
                if (ev.key === 'Shift') this.constrainEnabled = true;
            })
            .addKeyUpListener((ev) => {
                if (ev.key === 'Shift') this.constrainEnabled = false;
            });
    }

    startTransform(
        startPoint: ModelCordPoint,
        entities: EntityMap,
        transformType: TransformType,
        options?: {
            session?: PageEditSession;
            autoCommit?: boolean;
        }
    ) {
        this.session = options?.session ?? this.controller.newSession();
        this.autoCommit = options?.autoCommit ?? true;
        this.startPoint = startPoint;
        this.entities = entities;
        this.startBox = Entity.computeBoundingBox(entities);
        this.transformType = transformType;

        this.linkedLines = {};
        for (const entity of Object.values(this.controller.state.page.entities)) {
            if (!LineEntity.isLine(entity)) continue;

            if (entity.linkedEntityId1 !== null) {
                (this.linkedLines[entity.linkedEntityId1] ?? (this.linkedLines[entity.linkedEntityId1] = [])).push(
                    entity
                );
            }
            if (entity.linkedEntityId2 !== null) {
                (this.linkedLines[entity.linkedEntityId2] ?? (this.linkedLines[entity.linkedEntityId2] = [])).push(
                    entity
                );
            }
        }

        this.snapExtension.showGuide();
    }

    readonly onTransformEnd = EventDispatcher(() => {
        if (this.autoCommit) this.session?.commit();
        this.session = null;

        this.snapExtension.hideGuide();
    });

    private readonly onMouseMove = (ev: MouseEventInfo) => {
        const { point: nextPoint } = ev;
        const { startPoint, entities, startBox, transformType } = this;
        if (startPoint === null || entities === null || startBox === null || transformType === null) return;

        const scaleOrigin = transformType.scaleOrigin(startBox);
        const transform = Transform.scale(
            transformType.scaleFactor.x(startBox, startPoint, nextPoint),
            transformType.scaleFactor.y(startBox, startPoint, nextPoint),
            scaleOrigin.x,
            scaleOrigin.y
        ).then(transformType.translate(startBox, startPoint, nextPoint));

        if (this.snapExtension.store.state.enabled) {
            const { transform: snapTransform } = snapBox(
                transform.apply(startBox),
                Record.filter(this.controller.state.page.entities, (entity) => !(entity.id in entities)),
                transformType,
                16 / this.controller.state.camera.scale
            );
            transform.then(snapTransform);
        }

        if (this.constrainEnabled) {
            const scale = Math.max(transform.scaleX, transform.scaleY);
            const originPoint = transformType.scaleOrigin(startBox);
            transform.then(
                Transform.scale(scale / transform.scaleX, scale / transform.scaleY, originPoint.x, originPoint.y)
            );
        }

        const patches: Record<string, Patch<Entity>> = {};
        for (const prevEntity of Object.values(entities)) {
            patches[prevEntity.id] = Entity.transform(prevEntity, transform);

            if (prevEntity.type === 'rect') {
                for (const line of this.linkedLines[prevEntity.id] ?? []) {
                    if (line.linkedEntityId1 === prevEntity.id) {
                        patches[line.id] = { p1: transform.apply(line.p1) };
                    }
                    if (line.linkedEntityId2 === prevEntity.id) {
                        patches[line.id] = { p2: transform.apply(line.p2) };
                    }
                }
            }
        }

        this.session?.updateEntities('transform', patches);
    };

    private readonly onMouseUp = () => {
        if (this.startPoint === null || this.entities === null || this.startBox === null || this.transformType === null)
            return;

        this.startPoint = null;
        this.entities = null;
        this.startBox = null;
        this.transformType = null;
        this.onTransformEnd();
    };
}
