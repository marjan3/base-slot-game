import {Counter} from "./win/counter";
import Reels from "./reels";
import Background from "./background";
import * as dat from "dat.gui";
import {Foreground} from "./foreground";
import {Game} from "../main";
import {Intro} from "./intro";

export class Stage {
    public reels: Reels;
    public counter: Counter;
    public background: Background;
    private foreground: Foreground;
    intro: Intro;

    constructor() {

        const app = window.Game.pixiApp;
        app.stage.name = "Main Stage";
        app.stage.position.set(app.screen.width / 2, app.screen.height / 2);

        // var gui = new dat.GUI();
        // addDatGuiProperties(gui, this.ui.top);

        // var menu = new dat.GUI();

        // app.stage.children.forEach(c => {
        //   const name = c.constructor.name + (c.name ? ` [${c.name}]` : "");
        //   const folder = menu.addFolder(name);
        //   folder.domElement.onclick = () => {
        //     console.log("YUUUUUPIIIIIIII");
        //   };
        //   // addDatGuiProperties(folder, this.ui.top);
        // });
    }

    setupIntro(introAssets: Map<string, PIXI.spine.core.SkeletonData>) {
        const app = Game.pixiApp;
        this.intro = new Intro(introAssets);
        app.stage.addChild(this.intro.container);
    }

    setupBackground(assets: any) {
        const app = Game.pixiApp;
        this.background = new Background(assets);
        app.stage.addChild(this.background.container);
    }

    setupReels(reelsAssets: any, symbolAssets: any) {
        const app = Game.pixiApp;
        this.reels = new Reels(reelsAssets, symbolAssets);
        app.stage.addChild(this.reels.container);
    }

    setupCounter() {
        const app = Game.pixiApp;
        this.counter = new Counter();
        app.stage.addChild(this.counter);
    }

    setupForeground(foregroundAssets: Map<string, PIXI.spine.core.SkeletonData>) {
        const app = Game.pixiApp;
        this.foreground = new Foreground(foregroundAssets);
        app.stage.addChild(this.foreground.container);
    }

    showAll() {
        this.background.container.visible = true;
        this.reels.container.visible = true;
        this.foreground.container.visible = true;
    }
}

const propertiesMap = {
    Graphics: [
        "name",
        "rotation",
        "width",
        "height",
        "pivot",
        "position",
        "scale",
        "skew",
        "alpha",
        "visible",
        "renderable",
        "mask",
        "isMask",
        "buttonMode",
        "interactive",
        "interactiveChildren",
        "updateLocalBounds",
        "updateTransform",
        "removeAllListeners",
        "removeChildren",
        "clear",
        "destroy"
    ],
    ObservablePoint: ["x", "y"]
};

function addDatGuiProperties(gui: dat.GUI, object: any) {
    propertiesMap[object.constructor.name]
    // cause dat gui throws error on null objects
        .filter(key => object[key] != null)
        .forEach(key => {
            if (object[key] instanceof Object && !(object[key] instanceof Function)) {
                addDatGuiProperties(gui.addFolder(key), object[key]);
            } else {
                try {
                    gui.add(object, key);
                } catch (err) {
                    console.log(key, err);
                }
            }
        });
}
