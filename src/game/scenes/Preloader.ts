import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background');
    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
    this.load.on('progress', (progress: number) => {
      bar.width = 4 + (460 * progress);
    });
  }

  preload() {
    //  Load the assets for the game
    this.#loadAssassinSprites();
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    this.#createAssassinSprites();
    this.scene.start('MainMenu');
  }

  #createAssassinSprites() {
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers('assassin_attack', { start: 0, end: 4 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'special',
      frames: this.anims.generateFrameNumbers('assassin_special', { start: 0, end: 4 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'hit',
      frames: this.anims.generateFrameNumbers('assassin_hit', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('assassin_run', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: 1,
    });
  }

  #loadAssassinSprites() {
    this.load.setPath('../assets/assassin');

    this.load.image('assassin_idle', 'assassin_idle.png');
    this.load.spritesheet('assassin_attack', 'assassin_attack.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('assassin_special', 'assassin_special.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('assassin_hit', 'assassin_hit.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('assassin_run', 'assassin_run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }
}
