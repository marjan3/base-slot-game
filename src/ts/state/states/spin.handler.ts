import { GameStateHandler } from "..";
import { Stage } from "../../stage";

export default class SpinGameStateHandler implements GameStateHandler {
  public stateId: string = "spin";

  public async handle() {
    const stage: Stage = window.Game.stage;

    await new Promise( resolve => {
      window.Game.ui.observable.on("spinStarted", ()=> {
        resolve();
      })
    });

    await stage.reels.spin([
      ["SYM7", "SYM7", "SYM7", "SYM7"],
      ["SYM4", "SYM7", "SYM6", "SYM10"],
      ["SYM6", "SYM5", "SYM3", "SYM11"],
      ["SYM10", "SYM6", "SYM2", "SYM10"],
      ["SYM5", "SYM2", "SYM1", "SYM11"]
    ]);
    // TODO: is win
    const isWin = true;
    if (isWin) {
      return "NEXT_WIN";
    } else {
      return "idle";
    }
  }
}
