import "babel-polyfill";
import * as PIXI from "pixi.js";

import {Stage} from "./stage";
import gameStateMachine from "./state";

declare global {
    export interface IGame {
        pixiApp: PIXI.Application;
        ui: any;
        stage: Stage;
    }
    export interface Window {
        Game: IGame | any;
        PIXI: any;
    }
}

window.Game = {};
window.PIXI = PIXI;

export const Game = window.Game;

gameStateMachine.start();
