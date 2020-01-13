import {createSpine, setAnimation} from "../utils/spine.utils";

export default class Background {
    private readonly  spine: PIXI.spine.Spine;
    public readonly container: PIXI.Container;

    constructor(spineAssets: Map<string, any>){
        const spine = createSpine(spineAssets.get("background"));
        this.container = new PIXI.Container();
        this.spine = this.container.addChild(spine);
        this.container.visible = false;
    }

    show() {
        setAnimation(this.spine, 0,"landscape", false);
    }
}