import {createSpine, getSlotFromName, setAnimation} from "../utils/spine.utils";
import {basicReelStrips} from "../reel-strips";
import {createBlurYMask, createMask, debug} from "../utils/pixi.utils";
import {Calculator} from "../utils/calculator";


export const spacingHeight = 20;
export const offsetTop = 20;
export const symbolHeight = 200;

export interface VisualReel {
    container: PIXI.Container,
    symbols: Array<PIXI.spine.Spine>,
    blur: PIXI.filters.BlurFilter
}

export function addSymbolsToSpine(symbolsAssets: any, reelSpine: PIXI.spine.Spine, numOfReels, numOfRows) {
    const visualReels = [] as Array<any>;

    for (let i = 0; i < numOfReels; i++) {
        const slotContainer = getSlotFromName(reelSpine, "reel" + (i + 1));
        slotContainer.name = "Reel" + i;
        const reel = new PIXI.Container();
        reel.scale.set(1, -1);
        slotContainer.addChild(reel);
        const mask = createBlurYMask(slotContainer.width, slotContainer.height);
        reel.addChild(mask);
        reel.mask = mask;
        const visualReel = {
            container: reel,
            symbols: [] as Array<PIXI.spine.Spine>,
            blur: new PIXI.filters.BlurFilter()
        };
        visualReel.blur.blurX = 0;
        visualReel.blur.blurY = 0;
        visualReel.container.filters = [visualReel.blur];

        for (let j = 0; j < numOfRows; j++) {
            const symName = basicReelStrips[i][j];
            const symbol = createSpine(symbolsAssets.get("symbols"));
            symbol.name = symName;
            symbol.skeleton.setSkinByName(symName.toLowerCase());
            // Scale the symbol to fit symbol area.
            symbol.x = 0;
            // how to position symbol within reel:
            // step 1: position
            symbol.y = Calculator.calculatePositionInReel(j, symbol.height, spacingHeight, -2);

            visualReel.symbols.push(symbol);
            visualReel.container.addChild(symbol);
        }
        visualReels.push(visualReel);
    }
    return visualReels;
}

