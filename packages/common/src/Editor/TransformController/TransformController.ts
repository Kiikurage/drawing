import { DragSession } from '@drawing/common/src/Editor/GestureRecognizer/DragSession';
import { PageEditSession } from '../PageController/PageEditSession';
import { PageController } from '../PageController/PageController';
import { TransformSession } from './TransformSession';
import { TransformState } from './TransformState';
import { CameraController } from '@drawing/common/src/Editor/CameraController/CameraController';
import { EditorViewEvents } from '../EditorViewEvents/EditorViewEvents';
import { SingleLineTransformSession } from './SingleLineTransformSession';
import { Store } from '@drawing/common/src/lib/Store';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { TransformType } from '@drawing/common/src/model/TransformType';
import { LineEntity } from '@drawing/common/src/model/page/entity/LineEntity';

export class TransformController {
    readonly store = new Store(TransformState.create());
    private activeSessionCounts = 0;

    constructor(
        private readonly pageController: PageController,
        private readonly cameraController: CameraController,
        private readonly editorViewEvents: EditorViewEvents
    ) {
        this.editorViewEvents.onKeyDown.addListener((ev) => {
            if (ev.key === 'Control') this.enableSnap();
        });
        this.editorViewEvents.onKeyUp.addListener((ev) => {
            if (ev.key === 'Control') this.disableSnap();
        });
        this.editorViewEvents.onKeyDown.addListener((ev) => {
            if (ev.key === 'Shift') this.enableConstraints();
        });
        this.editorViewEvents.onKeyUp.addListener((ev) => {
            if (ev.key === 'Shift') this.disableConstraints();
        });
    }

    enableSnap() {
        this.store.setState({ snapEnabled: true });
    }

    disableSnap() {
        this.store.setState({ snapEnabled: false });
    }

    enableConstraints() {
        this.store.setState({ constraintsEnabled: true });
    }

    disableConstraints() {
        this.store.setState({ constraintsEnabled: false });
    }

    showSnapGuide() {
        this.store.setState({ snapGuideVisible: true });
    }

    hideSnapGuide() {
        this.store.setState({ snapGuideVisible: false });
    }

    newSession(options: {
        entities: Entity[];
        transformType: TransformType;
        dragSession: DragSession;
        pageEditSession?: PageEditSession;
        autoCommit?: boolean;
    }): TransformSession {
        const session = new TransformSession(
            options.entities,
            options.transformType,
            options.dragSession,
            this.pageController,
            this.store,
            this.cameraController,
            options.pageEditSession ?? this.pageController.newSession(),
            options.autoCommit ?? true
        );

        session.onEnd.addListener(() => {
            this.activeSessionCounts -= 1;
            if (this.activeSessionCounts === 0) {
                this.hideSnapGuide();
            }
        });

        if (this.activeSessionCounts === 0) {
            this.showSnapGuide();
        }
        this.activeSessionCounts += 1;

        return session;
    }

    newSingleLineTransformSession(options: {
        entity: LineEntity;
        point: 'p1' | 'p2';
        dragSession: DragSession;
        pageEditSession?: PageEditSession;
        autoCommit?: boolean;
    }): SingleLineTransformSession {
        const session = new SingleLineTransformSession(
            options.entity,
            options.point,
            options.dragSession,
            this.pageController,
            this.store,
            options.pageEditSession ?? this.pageController.newSession(),
            options.autoCommit ?? true
        );

        session.onEnd.addListener(() => {
            this.activeSessionCounts -= 1;
            if (this.activeSessionCounts === 0) {
                this.hideSnapGuide();
            }
        });

        if (this.activeSessionCounts === 0) {
            this.showSnapGuide();
        }
        this.activeSessionCounts += 1;

        return session;
    }
}
