const tw = require('@mtanevski/tweener');

import { Ease } from '../../utils/ease';

const tweener = new tw.tweener.Tweener();

async function delay() {
  const test = {
    x: 1
  };
  return tweener
    .new()
    .tween(test, 'x', 100, 1000.0, Ease.backout(0.6))
    .startAsPromise();
}

async function countUp(counter: PIXI.Text) {
  return tweener
    .new()
    .tween(counter, 'text', 100, 5000.0, Ease.backout(0.6), x => {
      return x > 100 ? 100 : Math.floor(x);
    })
    .startAsPromise();
}

async function increaseFont(counter: PIXI.Text) {
  return tweener
    .new()
    .tween(counter.style, 'fontSize', 180, 5000.0, Ease.backout(0.6))
    .startAsPromise();
}

export default { delay, countUp, increaseFont };
