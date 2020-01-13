import {createSpine, setAnimation} from "../utils/spine.utils";
import {addSymbolsToSpine, spacingHeight, symbolHeight, VisualReel} from "./symbols";
import {VirtualReel, VirtualReelArea} from "../external/virtual-reels";

import {basicReelStrips} from "../reel-strips";
import {Calculator} from "../utils/calculator";

export const NUMBER_OF_REELS = 5;
export const NUMBER_OF_ROWS = 4;

export default class Reels {
    private readonly spine: PIXI.spine.Spine;
    public readonly container: PIXI.Container;


    private visualReels: VisualReel[];


    private virtualReelArea: VirtualReelArea;

    private outcome: string[][];
    private reelStrips: string[][];

    constructor(reelsAssets: Map<string, any>, symbolsAssets: Map<string, any>) {
        const reelSpine = createSpine(reelsAssets.get("reels"));
        this.visualReels = addSymbolsToSpine(symbolsAssets, reelSpine, NUMBER_OF_REELS, NUMBER_OF_ROWS);
        this.container = new PIXI.Container();
        this.spine = this.container.addChild(reelSpine);
        this.reelStrips = basicReelStrips;

        this.virtualReelArea = new VirtualReelArea(5);
        // Listen for animate update.
        for (let i = 0; i < this.visualReels.length; i++) {
            // VIRTUAL REELS
            const virtualReel = this.virtualReelArea.getReel(i);
            const visualReel = this.visualReels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.
            this.updateReel(visualReel, virtualReel, i);
        }
        this.container.visible = false;
    }

    show() {
        setAnimation(this.spine, 0, "idle", false);
    }

    public async spin(outcome: string[][]): Promise<any> {
        const app = window.Game.pixiApp;
        app.ticker.add(this.updateReels);
        this.outcome = outcome;
        await new Promise(resolve => {
            this.virtualReelArea.startSpin(resolve);
        });
        app.ticker.remove(this.updateReels);
    }

    public showWinningSymbols(winLines: string[]) {
        for (let i = 0; i < this.visualReels.length; i++) {
            const r = this.visualReels[i];

            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                if (winLines.indexOf("" + i + j) !== -1) {
                    continue;
                }

                // setAnimation(s, 1, "noWin");
                setAnimation(s, 1, "noWin");
            }
        }
        winLines.forEach(line => {
            const r = Number(line[0]);
            const s = Number(line[1]);
            const symbol = this.visualReels[r].symbols[s];

            setAnimation(symbol, 1, "win");
        });
    }

    public showAllSymbols() {
        for (let i = 0; i < this.visualReels.length; i++) {
            const r = this.visualReels[i];

            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                setAnimation(s, 1, "idle");
            }
        }
    }

    private updateReels = () => {
        // Update the slots.
        // VIRTUAL REELS
        for (let i = 0; i < this.visualReels.length; i++) {
            // VIRTUAL REELS
            const virtualReel = this.virtualReelArea.getReel(i);
            const visualReel = this.visualReels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.
            if (virtualReel.speed !== 0) {
                this.updateReel(visualReel, virtualReel, i);
            }
        }
    };

    private updateReel(r: VisualReel, virtualReel: VirtualReel, i: number) {
        r.blur.blurY = virtualReel.speed * (symbolHeight / 3);
        // r.blur.blurY = virtualReel.position - virtualReel.previousPosition;
        // VIRTUAL REELS
        // virtualReel.previousPosition = virtualReel.position;
        // Update symbol positions on r.
        // VIRTUAL REELS
        for (let j = 0; j < r.symbols.length; j++) {
            const s = r.symbols[j];
            const prevy = s.y;
            const indexY = ((virtualReel.position + j) % r.symbols.length);
            s.y = Calculator.calculatePositionInReel(indexY, symbolHeight, spacingHeight, -2);
            if (s.y < 0 && prevy > symbolHeight ) {
                // Detect going over and swap a texture.
                // This should in proper product be determined from some logical r.
                // MOVE OUT OF VIRTUAL REELS
                const diff = virtualReel.targetPosition - virtualReel.position;
                const justBeforeStopping = diff <= 3 && diff >= 0;
                // TODO: DEBUG
                // if (i === 0) {
                //   console.log("SWAP-------------------------------");
                //   console.log("virtualReel: " + i);
                //   console.log("virtualReel.speed: " + virtualReel.speed);
                //   console.log("virtualReel.position: " + virtualReel.position);
                //   console.log("SWAP");
                // }
                if (justBeforeStopping) {
                    s.name = this.outcome[i][j];
                    s.skeleton.setSkinByName(this.outcome[i][j].toLowerCase());

                } else {
                    s.name = this.reelStrips[i][
                        Math.floor(Math.random() * this.reelStrips[i].length)
                        ];
                    s.skeleton.setSkinByName(s.name.toLowerCase());
                }
                // s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                // MOVE OUT OF VIRTUAL REELS
                // s.scale.x = s.scale.y = Math.min(
                //   SYMBOL_SIZE / s.texture.width,
                //   SYMBOL_SIZE / s.texture.height
                // );
                // s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
            }
        }
    }
}