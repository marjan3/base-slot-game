import * as PIXI from "pixi.js";

enum Color {
    Yelllow = 0xFFFF00
}

export function debug(container: PIXI.Container, title: string | any) {
    const debug = new PIXI.Graphics();

    debug.lineStyle(1);
    debug.beginFill(Color.Yelllow);
    debug.drawRect(container.x, container.y, container.width, container.height);
    debug.endFill();
    let debugText = createText("debugText" + title, title, {
        fontFamily: "Arial",
        fontSize: 80
    });
    debugText.scale.set(1, -1);
    debugText.position.set(container.width / 2, container.height / 2);
    debug.addChild(debugText);

    debug.pivot.set(container.width / 2, container.height / 2);

    container.addChild(debug);

    return debug;
}


function createText(name: string, string: string, style?: PIXI.TextStyleOptions) {
    const text = new PIXI.Text(
        string,
        style
    );
    text.name = name;
    text.anchor.set(0.5, 0.5);
    return text;
}

function createBitmapText(name: string, string: string, style: PIXI.extras.BitmapTextStyle, scale = 1) {
    const bitmapText = new PIXI.extras.BitmapText(string, style);
    bitmapText.name = name;
    bitmapText.anchor = new PIXI.Point(0.5, 0);
    bitmapText.scale.set(scale, -scale);
    return bitmapText;
}

export function createMask(width: number, height: number): PIXI.Graphics {
    const mask = new PIXI.Graphics();

    mask.lineStyle(0);
    mask.beginFill(0x000000);
    mask.drawRect(0, 0, width, height);
    mask.endFill();

    mask.pivot.set(width / 2, height / 2);

    return mask;
}

function createFlippedYText(name: string, string: string, style: PIXI.TextStyleOptions, scale = 1) {
    const text = createText(name, string, style);
    text.scale.set(scale, -scale);
    return text;
}

function createBlurYMask(width: number, height: number): PIXI.Graphics | PIXI.Sprite {

    const mask = new PIXI.Graphics();

    mask.lineStyle(0);
    mask.beginFill(0xffffff, 1);
    mask.drawRect(0, 0, width, height);
    mask.endFill();

    // Adding filter to mask:
    // https://github.com/pixijs/pixi.js/issues/4451
    const renderTexture = PIXI.RenderTexture.create(width, height);
    const sprite = new PIXI.Sprite(renderTexture);
    sprite.pivot.set(width / 2, height / 2);

    mask.filters = [new PIXI.filters.BlurYFilter(25)];

    const app = window.Game.pixiApp;
    app.renderer.render(mask, renderTexture);

    return sprite;
}

export async function loadImages(images: Map<string, string>): Promise<void>{
    const app = window.Game.pixiApp;
    return new Promise(resolve => {
        images.forEach( (k,v) => {
            app.loader.add(v, k);
        });
        app.loader.load(() => {
            resolve();
        });
    });
}

export {
    createText,
    createBitmapText,
    createFlippedYText,
    createBlurYMask
};
