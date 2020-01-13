import 'pixi-spine';
import * as PIXI from "pixi.js";

export function createPIXIApplication() {
    var size = [1920, 1080];
    var ratio = size[0] / size[1];

    const app = new PIXI.Application({
        width: size[0],
        height: size[1],
        antialias: true,
        transparent: false
    });

    function resize() {
        // Resizing solution taked from:
        // https://stackoverflow.com/questions/30554533/dynamically-resize-the-pixi-stage-and-its-contents-on-window-resize-and-window
        if (window.innerWidth / window.innerHeight >= ratio) {
            // TODO: provide it from game ui;
            const topOffset = 72;
            const height = window.innerHeight - topOffset;
            var w = height * ratio;
            var h = height;
        } else {
            var w = window.innerWidth;
            var h = window.innerWidth / ratio;
        }

        app.view.style.width = w + "px";
        app.view.style.height = h + "px";
    }

    app.renderer.backgroundColor = 0xdde0e4;
    window.onresize = resize;


    window.Game.pixiApp = app;

    return { app, resize };
}




