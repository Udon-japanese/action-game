import Phaser from 'phaser';
import LoadingScene from '../src/loadScene';
import TitleScene from '../src/drawTitle';
import MainScene from '../src/stage1';

const config = {
  parent: 'game',
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  scene: [LoadingScene, TitleScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  }
}
const game = new Phaser.Game(config);