export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene', active: false });
  }
  preload() {
  }
  create() {
    const { width, height } = this.game.canvas;
    this.add.image(400, 300, 'sky');
    this.add.text(80, 100, 'アイワナ', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setFontSize(128).setColor('#00f');
    this.add.text(100, 300, 'クリックしてはじめる').setFontSize(32).setColor('#00f');
    const zone = this.add.zone(width / 2, height / 2, width, height);
    zone.setInteractive({
      useHandCursor: true
    });
    zone.on('pointerdown', () => {
      this.scene.start("MainScene")
    });
  }
  update() {
  }
}