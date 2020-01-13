import { GameStateHandler } from "..";
import { Stage } from "../../stage";

export default class WinGameStateHandler implements GameStateHandler {
  public stateId: string = "win";

  public async handle() {
    const stage: Stage = window.Game.stage;

    stage.reels.showWinningSymbols(["01", "00", "02", "11"]);
    await stage.counter.countUp();
    stage.reels.showAllSymbols();
  }
}
