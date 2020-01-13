/**
 * Easing function from https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
 */
export const Ease = {
  backout(amount: number): (x: number) => number {
    return (t: number): number => {
      return --t * t * ((amount + 1) * t + amount) + 1;
    };
  },
  getPowIn(pow: number): (x: number) => number {
    return function(t) {
      return Math.pow(t, pow);
    };
  },
  getPowOut(pow): (x: number) => number {
    return function(t) {
      return 1 - Math.pow(1 - t, pow);
    };
  },
   bounceOut: () => {
        return function(t) {
          if (t < 1 / 2.75) {
            return (7.5625 * t * t);
          } else if (t < 2 / 2.75) {
            return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
          } else if (t < 2.5 / 2.75) {
            return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
          } else {
            return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
          }
        }
  },
  bounceIn: () => {
    return function (t: number) {
      return 1 - Ease.bounceOut()(1 - t);
    }
  },
  bounceInOut: () => {
    return function (t: number) {
      if (t < 0.5) return Ease.bounceIn()(t * 2) * .5;
      return Ease.bounceOut()(t * 2 - 1) * 0.5 + 0.5;
    }
  }
};
