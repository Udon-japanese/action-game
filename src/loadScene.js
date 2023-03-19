export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadingScene', active: true });
  }
  preload() {
  }
  create() {
    const { width, height } = this.game.canvas;

    const currentLoadingText = this.add.text(width / 2, height / 2, 'ロード中... 0%').setFontSize(32).setOrigin(0.5);

    this.load.image('sky', 'images/assets/sky.png');
    this.load.image('ground', 'images/assets/platform.png');
    this.load.image('star', 'images/assets/star.png');
    this.load.image('bomb', 'images/assets/bomb.png');
    this.load.spritesheet('dude', 'images/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('player', 'images/assets/player.PNG', { frameWidth: 489.7, frameHeight: 462 });

    this.load.on('progress', (progress) => {
      currentLoadingText.text = 'ロード中...' + Math.round(progress * 100) + "%";
    });
    this.load.on('complete', () => {
      this.scene.start('TitleScene');
    });
    this.load.start();
  }
  update() {
  }
}
