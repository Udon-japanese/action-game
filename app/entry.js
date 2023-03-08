import Phaser from 'phaser'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [Stage1, Stage2]
};

const game = new Phaser.Game(config);
let platforms;
let player;
let cursors;
let stars;
let score = 0;
let scoreText;
let gameOver = false;
let bombs;
let jumpCounter = 0;
let maxJumps = 2;

class Stage1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Stage1', active: true });
  }
  preload() {
    // initPreload.call(this);
    this.load.image('sky', 'images/assets/sky.png');
    this.load.image('ground', 'images/assets/platform.png');
    this.load.image('star', 'images/assets/star.png');
    this.load.image('bomb', 'images/assets/bomb.png');
    this.load.spritesheet('dude', 'images/assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }
  create() {
    // initCreate.call(this);
    platforms = null;
    player = null;
    cursors = null;
    stars = null;
    score = 0;
    scoreText = null;
    gameOver = false;
    bombs = null;
    jumpCounter = 0;
    maxJumps = 2;
    
    this.add.image(400, 300, 'sky');
    
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();// refreshBody により、サイズ変更を物理的に扱えるよう反映させる
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,// 1秒あたり10フレーム
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    player.body.setGravityY(700);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(child => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
  }
  update() {
    // manageUpdate.call(this);
    if (gameOver) return;
    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);

      player.anims.play('turn');
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
      jumpCounter++;
      jump(-450);
    }

    if (player.body.touching.down) {
      jumpCounter = 0;
    }
  }
}

class Stage2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Stage2', active: false });
  }
  preload() {
    // initPreload.call(this);
    this.load.image('sky', 'images/assets/sky.png');
    this.load.image('ground', 'images/assets/platform.png');
    this.load.image('star', 'images/assets/star.png');
    this.load.image('bomb', 'images/assets/bomb.png');
    this.load.spritesheet('dude', 'images/assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }
  create() {
    // initCreate.call(this);
    platforms = null;
    player = null;
    cursors = null;
    stars = null;
    score = 0;
    scoreText = null;
    gameOver = false;
    bombs = null;
    jumpCounter = 0;
    maxJumps = 2;

    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();// refreshBody により、サイズ変更を物理的に扱えるよう反映させる
    platforms.create(650, 300, 'ground');
    platforms.create(10, 280, 'ground');
    platforms.create(450, 450, 'ground');
    
    player = this.physics.add.sprite(100, 450, 'dude');

    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,// 1秒あたり10フレーム
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    player.body.setGravityY(700);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(child => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
  }
  update() {
    // manageUpdate.call(this);
    if (gameOver) return;
    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);

      player.anims.play('turn');
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
      jumpCounter++;
      jump(-450);
    }

    if (player.body.touching.down) {
      jumpCounter = 0;
    }
  }
}


function initPreload() {

}

function initCreate() {

}

function manageUpdate() {

}



function jump(velocityY) {
  if (jumpCounter < maxJumps) {
    player.setVelocityY(velocityY);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText(`Score: ${score}`);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(child => {
      child.enableBody(true, child.x, 0, true, true);
    });

    let x = (player.x < 400)
      ?
      Phaser.Math.Between(400, 800)
      :
      Phaser.Math.Between(0, 400);
    let bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
}