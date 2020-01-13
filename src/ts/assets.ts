export const assets = {
    images: new Map([
        ["SYM1", "images/sym1.png"],
        ["SYM2", "images/sym2.png"],
        ["SYM3", "images/sym3.png"],
        ["SYM4", "images/sym4.png"],
        ["SYM5", "images/symDiamond1.png"],
        ["SYM6", "images/symDiamond2.png"],
        ["SYM7", "images/symDiamond3.png"],
        ["SYM8", "images/symDiamond4.png"],
        ["SYMW", "images/symWild.png"],
        ["SYMS", "images/symScatter.png"]
    ]),
    spines: {
        background: new Map([
            ["background", "spines/background/background.json"]
        ]),
        reels: new Map([
            ["reels", "spines/reels/reels.json"]
        ]),
        symbols: new Map([
            ["symbols", "spines/symbols/symbols.json"]
        ]),
        foreground: new Map([
            ["foreground", "spines/foreground/foreground.json"]
        ]),
        intro: new Map([
            ["intro", "spines/intro/intro.json"]
        ])
    }
};