
import { Tweener, Tweening } from "@mtanevski/tweener";
import { Ease } from "../utils/ease";

export class VirtualReel {
  position: number;
  previousPosition: number;
  targetPosition: number;
  time: number;
  tweening: Tweening | null;
  speed: number;

  constructor() {
    this.targetPosition = 0;
    this.time = 0;
    this.position = 0;
    this.previousPosition = 0;
    this.speed = 0;
    this.tweening = null;
  }
}

export class VirtualReelArea {
  private readonly numberOfReels: number;
  private readonly virtualReels: Array<VirtualReel>;

  private spinning = false;
  private readonly tweener;

  public constructor(numberOfReels: number) {
    this.numberOfReels = numberOfReels;
    this.virtualReels = [];
    for (let i = 0; i < this.numberOfReels; i++) {
      const virtualReel = new VirtualReel();
      this.virtualReels.push(virtualReel);
    }
    this.tweener = new Tweener();
  }

  public getReel(reelIndex: number): VirtualReel {
    return this.virtualReels[reelIndex];
  }

  public startSpin(
    // spinConfig?: VirtualSpinConfiguration,
    // stopPositionsPerReel?: Array<number>,
    resolve?: Function
  ) {
    if (this.spinning) return;
    this.spinning = true;

    const reels = this.virtualReels;

    const reelsComplete = () => {
      this.spinning = false;
      for (let i = 0; i < this.virtualReels.length; i++) {
        const r = this.virtualReels[i];
        // TODO: fix this since its causing issues
        r.position = 0;
        r.previousPosition = 0;
        r.speed = 0;
      }
      if (resolve) {
        resolve();
      }
    };

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Randomness to reel spinning
      //   const extra = Math.floor(Math.random() * 3);
      const extra = 3;
      const target = r.position + 10 + i * 5 + extra;
      const time = 500 + i * 600 + extra * 600;
      let lastItemIndex = reels.length - 1;
      r.targetPosition = target;
      r.time = time;
      r.tweening = this.tweener
        .new()
        .tween(
          r,
          "position",
          target,
          time,
          Ease.backout(0.7),
          x => x,
          r.position,
          () => {
            // const calculateActualReelPosition =  (position, target, stopAt, reelStripLength) => {
            //     return Math.round((position + (stopAt + (reelStripLength-target))) % reelStripLength);
            // };
            //
            // r.stopPosition = calculateActualReelPosition(r.position, target, 8, r.reelStrip.length);
            r.speed = r.position - r.previousPosition;
            // VIRTUAL REELS
            r.previousPosition = r.position;
          },
          i === lastItemIndex ? reelsComplete : () => {}
        )
        .start();
    }
  }

  public stopSpin() {
    // this.tweener.tween().stop();
    this.spinning = false;
  }
}
