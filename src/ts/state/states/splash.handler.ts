import { GameStateHandler } from "..";
import {loadSpineAssets} from "../../utils/spine.utils";
import {assets} from "../../assets";
import {delay} from "../../utils/calculator";
const WebFont = require("webfontloader");

export default class SplashGameStateHandler implements GameStateHandler {
  public stateId: string = "splash";

  public async handle() {
    // load fonts
    await window.Game.stage.intro.updateLoading(10);
    await WebFont.load({
      google: {
        families: ["Baloo"]
      }
    });

    // load background spine
    const backgroundAssets = await loadSpineAssets(assets.spines.background);
    window.Game.stage.setupBackground(backgroundAssets);
    await window.Game.stage.intro.updateLoading(20);

    // load reel & symbols spine
    const reelsAssets = await loadSpineAssets(assets.spines.reels);
    const symbolsAssets = await loadSpineAssets(assets.spines.symbols);
    window.Game.stage.setupReels(reelsAssets, symbolsAssets);
    await window.Game.stage.intro.updateLoading(50);

    // load foreground spine
    const foregroundAssets = await loadSpineAssets(assets.spines.foreground);
    window.Game.stage.setupForeground(foregroundAssets);
    await window.Game.stage.intro.updateLoading(80);

    // load counter
    window.Game.stage.setupCounter();
    await window.Game.stage.intro.updateLoading(100);
    await window.Game.stage.intro.showDialog();

    window.Game.stage.showAll();
  }
}
