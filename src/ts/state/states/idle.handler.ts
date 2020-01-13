import { GameStateHandler } from "..";

export default class IdleGameStateHandler implements GameStateHandler {
  public stateId: string = "idle";

  public async handle() {
    window.Game.ui.observable.emit("spinEnded");
  }
}
