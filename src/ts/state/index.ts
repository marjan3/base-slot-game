import { Machine, interpret, Interpreter, StateMachine } from "xstate";
import LoadGameStateHandler from "./states/load.handler";
import SplashGameStateHandler from "./states/splash.handler";
import IdleGameStateHandler from "./states/idle.handler";
import SpinGameStateHandler from "./states/spin.handler";
import WinGameStateHandler from "./states/win.handler";

export const states = {
  load: "load",
  splash: "splash",
  idle: "idle",
  spin: "spin",
  win: "win"
};

export const actions = {
  next: "NEXT",
  nextWin: "NEXT_WIN",
  nextIdle: "NEXT_IDLE"
};

export const machine: StateMachine<any, any, any> = Machine({
  id: "slotState",
  initial: "load",
  states: {
    load: {
      on: { NEXT: "splash" }
    },
    splash: { on: { NEXT: "idle" } },
    idle: {
      on: { NEXT: "spin" }
    },
    spin: {
      on: {
        NEXT_WIN: "win",
        NEXT_IDLE: "idle"
      },
      invoke: [
        {
          id: "SPLASH",
          src: (context, event) => (callback, onEvent) => {
            console.log("asdokadksooakdsklasd");
          }
        }
      ]
    },
    win: {
      on: {
        NEXT: "idle"
      }
    }
  }
});

export interface GameStateHandler {
  [x: string]: any;
  /**
   * Unique state identifier
   */
  readonly stateId: string;
  /**
   * Handles actions for this state - return value determines next state - can be async
   */
  readonly handle: Function;
}

export class GameStateMachine {
  private currentStateId: string;
  private interpreter: Interpreter<any, any, any>;

  private existingStateMachine: StateMachine<any, any, any>;
  private gameStateHandlers: { [key: string]: GameStateHandler } = {};

  constructor(existingStateMachine: StateMachine<any, any, any>) {
    this.existingStateMachine = existingStateMachine;
    this.currentStateId = String(existingStateMachine.config.initial);
    this.interpreter = interpret(this.existingStateMachine, {
      devTools: true
    });
  }

  public start(): void {
    this.interpreter
      .onTransition(async state => {
        await this.onStateTransition(state.value.toString());
      })
      .onEvent(x => console.log(`Game State onEvent ${x.type}`))
      .onSend(event => console.log(`Game State onSend ${event.type}`));
    this.interpreter.start();
  }

  public registerGameStateHandler(gameState: GameStateHandler) {
    if (this.gameStateHandlers[gameState.stateId]) {
      console.log(
        `Handler for gamestate ${gameState.stateId} already registered!`
      );
      return;
    }
    this.gameStateHandlers[gameState.stateId] = gameState;
    console.log(`GameStateHandler registered for id: ${gameState.stateId}`);
  }

  public getCurrentStateId(): string {
    return this.currentStateId;
  }

  private async onStateTransition(id: string) {
    this.currentStateId = id;
    if (this.gameStateHandlers[id]) {
      console.log(`Transitioned to state: ${id}`);
      const nextState = await this.gameStateHandlers[id].handle();
      this.interpreter.send(nextState === undefined ? "NEXT" : nextState);
    }
  }
}

const gameStateMachine = new GameStateMachine(machine);
gameStateMachine.registerGameStateHandler(new LoadGameStateHandler());
gameStateMachine.registerGameStateHandler(new SplashGameStateHandler());
gameStateMachine.registerGameStateHandler(new IdleGameStateHandler());
gameStateMachine.registerGameStateHandler(new SpinGameStateHandler());
gameStateMachine.registerGameStateHandler(new WinGameStateHandler());
export default gameStateMachine;
