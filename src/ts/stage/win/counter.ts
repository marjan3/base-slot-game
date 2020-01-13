import animations from "./counter.animations";

export class Counter extends PIXI.Text {

  private static readonly DEFAULT_STYLE = {
    fontFamily: "Baloo",
    fontSize: 124,
    fill: ["#e6d197", "#fcba03"],
    align: "center"
  } as PIXI.TextStyle;

  constructor() {
    super("0");
    this.style = Counter.DEFAULT_STYLE;
    this.setup();
  }

  public async countUp() {
    await animations.delay();
    this.visible = true;
    await Promise.all([
      animations.countUp(this),
      animations.increaseFont(this)
    ]);
    this.style = Counter.DEFAULT_STYLE;
    this.text = "0";
    this.visible = false;
  }

  private setup() {
    this.visible = false;
    this.anchor.set(0.5);
  }
}
