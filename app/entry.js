import Phaser from 'phaser';
import LoadingScene from '../src/loadScene';
import TitleScene from '../src/drawTitle';
import MainScene from '../src/stage1';

const config = {
  type: Phaser.AUTO,
  scene: [LoadingScene, TitleScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true
    }
  },
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800 / window.devicePixelRatio,
    height: 600 / window.devicePixelRatio,
    zoom: 1 / window.devicePixelRatio
  }
}
const game = new Phaser.Game(config);