export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene', active: false });
    this.score = 0;
    this.gameOver = false;
  }
  preload() {
  }
  create() {
    this.bgImg = this.add.image(400, 300, 'sky');
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'player');

    this.player.setDisplaySize(33.7, 32);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(1000);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'turnRight',
      frames: [{ key: 'player', frame: 5 }],
      frameRate: 20
    });
		this.anims.create({
      key: 'turnLeft',
      frames: [{ key: 'player', frame: 2 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.bombs = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    this.player.anims.play('turn');
  }

  jumpCounter = 0;
  maxJumps = 2;
  upLongPressCounter = 0;
  maxLongPress = 25;

  update() {

    if (this.gameOver) {
      const { width, height } = this.game.canvas;
      let gameOverText = this.add.text(80, 100, 'がめおべら', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setFontSize(128).setColor('#f00');
      let clickPromptText = this.add.text(100, 300, 'クリックしてタイトルに戻る').setFontSize(32).setColor('#000');

      let zone = this.add.zone(width / 2, height / 2, width, height);

      zone.setInteractive({
        useHandCursor: true
      });
      zone.on('pointerdown', () => {
        this.score = 0;
        this.gameOver = false;
        this.scene.start("TitleScene");
      });
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
			
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
			
    } else if (Phaser.Input.Keyboard.JustUp(this.cursors.right)){
			this.player.setVelocityX(0);
			this.player.anims.play('turnRight');
			
    } else if (Phaser.Input.Keyboard.JustUp(this.cursors.left)) {
			this.player.setVelocityX(0);
			this.player.anims.play('turnLeft');
		}

    if (this.cursors.up.repeats >= 1) {
      if (this.upLongPressCounter >= this.maxLongPress) {
        this.upLongPressCounter = this.maxLongPress;

      } else {
        this.upLongPressCounter++;
      }

    } else {
      this.upLongPressCounter = 0;
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.jumpCounter++;

      if (this.jumpCounter < this.maxJumps) {
        this.player.setVelocityY(-300);

      } else {
        this.upLongPressCounter = 0;
      }
    }

    if (this.cursors.up.isDown && this.jumpCounter < this.maxJumps && this.upLongPressCounter < this.maxLongPress && !(this.upLongPressCounter === 0) && !this.player.body.touching.down) {

      if (this.jumpCounter === 1) {
        this.player.setVelocityY(-300 - (2 * this.upLongPressCounter));

      } else {
        this.player.setVelocityY(-300 - (3 * this.upLongPressCounter));
      }
    }

    if (this.player.body.touching.down) {
      this.jumpCounter = 0;
      this.upLongPressCounter = 0;
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
      let x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      let bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }
  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.gameOver = true;
  }
}