import {GameStateHandler} from "..";
import { Stage }  from "../../stage";
import {loadSpineAssets} from "../../utils/spine.utils";
import {assets} from "../../assets";
import {createPIXIApplication} from "../../pixi-application";

import {SlotUi} from "@mtanevski/slot-ui";

export default class LoadGameStateHandler implements GameStateHandler {
    public stateId: string = "load";

    public async handle() {

        // mount ui
        require("@mtanevski/slot-ui/dist/slot-ui.css");
        const config = {
            id: "yet-another-slot-game"
        };
        const gameUi = new SlotUi.GameUi(config).$mount("#slotGameEngineMountPoint");
        window.Game.ui = gameUi;

        // create PIXI application
        gameUi.observable.emit("updateLoading", { reason: "Creating application...", value: 10 });
        const { app, resize } = createPIXIApplication();

        // load spines
        gameUi.observable.emit("updateLoading", { reason: "Loading spines...", value: 60 });
        const introAssets = await loadSpineAssets(assets.spines.intro);

        // setup stage
        gameUi.observable.emit("updateLoading", { reason: "Setting up stage...", value: 90 });
        const stage = new Stage();
        stage.setupIntro(introAssets);
        stage.intro.show();
        window.Game = {...window.Game, stage: stage};

        // end
        gameUi.observable.on("loadingEnded", () => {
            window.console.log("loading ended");
            const game: HTMLElement = document.getElementById("yet-another-slot-game") as HTMLElement;
            game.appendChild(app.view);
            resize();
        });

        gameUi.observable.emit("updateLoading", { reason: "Loading ended", value: 100 });

        return;
    }
}
