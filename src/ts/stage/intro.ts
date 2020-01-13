import {createSpine, getSlotFromName, setAnimation} from "../utils/spine.utils";

enum SlotName {
    ContinueButton = "images/loading"
}

enum AnimationName {
    Idle = "idle",
    Load = "load",
    ShowDialog = "showDialog"
}

enum TrackIndex {
    ShowDialog = 2,
    Loading = 1,
    Idle = 0,

}

export class Intro {
    private readonly spine: PIXI.spine.Spine;
    public readonly container: PIXI.Container;
    private static readonly DIALOG_TIMEOUT = 30000;

    constructor(spineAssets: Map<string, any>){
        const spine = createSpine(spineAssets.get("intro"));
        this.container = new PIXI.Container();
        this.spine = this.container.addChild(spine);
    }

    show() {
        setAnimation(this.spine, TrackIndex.Idle, AnimationName.Idle, false);
        setAnimation(this.spine, TrackIndex.Idle, AnimationName.Load, false);
        const entry = this.spine.state.getCurrent(TrackIndex.Idle);
        entry.timeScale = 0;
    }

    public async updateLoading(progress?: number): Promise<void> {
        return new Promise<void>(resolve => {
            // pause animation
            const entry = this.spine.state.getCurrent(TrackIndex.Idle);
            entry.timeScale = 0;

            // play animation until progress value
            if (progress) {
                const stateUpdate = this.spine.state.update;
                this.spine.state.update = (delta: number) => {
                    stateUpdate.apply(this.spine.state, [delta]);
                    if (
                        entry.animation &&
                        entry.animation.name === AnimationName.Load
                        && entry.animationLast >= entry.animationEnd
                    ) {
                        entry.timeScale = 1;
                        this.spine.state.update = stateUpdate;
                        resolve();
                    }
                    if (
                        entry.animation &&
                        entry.animation.name === AnimationName.Load &&
                        entry.animationLast >= ((progress / 100) * entry.animationEnd)
                    ) {
                        entry.timeScale = 0;
                        this.spine.state.update = stateUpdate;
                        resolve();
                    }
                };

                entry.timeScale = 1;
            } else {
                resolve();
            }
        });
    }

    public async showDialog(){
        await new Promise((resolve) => {
            setAnimation(this.spine, TrackIndex.Idle, AnimationName.ShowDialog, true);

            const timeoutId = window.setTimeout(resolve, Intro.DIALOG_TIMEOUT);

            const button = getSlotFromName(this.spine, SlotName.ContinueButton);
            button.interactive = true;
            button.buttonMode = true;
            const triggerButtonPress = () => {
                window.clearTimeout(timeoutId);
                resolve();
            };
            button.addListener("pointerup", triggerButtonPress);
        });
        this.deactivateButtons();
        this.container.visible = false;
    }

    private deactivateButtons() {
        const button = getSlotFromName(this.spine, SlotName.ContinueButton);
        button.children.forEach( c => c.alpha = 0.0);
        button.interactive = false;
        button.buttonMode = false;
        button.removeAllListeners();
    }
}