import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    const backgrounds = ['bgDayNinja', 'bgDayDesert', 'bgNightNinja', 'bgNightDesert', 'bgSky', 'bgPlain'];

    const randomBackground = Phaser.Math.RND.pick(backgrounds);

    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, randomBackground);
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
    this.#loadMageSprites();
    this.#loadSherifSprites();
    this.load.json('fight1', 'fight1.json');
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    this.#createAssassinSprites();
    this.#createMageSprites();
    this.#createSherifSprites();
    this.scene.start('MainMenu');
  }

  #createAssassinSprites() {
    this.anims.create({
      key: 'assassin-idle',
      frames: this.anims.generateFrameNumbers('assassin-idle', { start: 0, end: 0 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'assassin-attack',
      frames: this.anims.generateFrameNumbers('assassin-attack', { start: 0, end: 4 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'assassin-special',
      frames: this.anims.generateFrameNumbers('assassin-special', { start: 0, end: 4 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'assassin-hit',
      frames: this.anims.generateFrameNumbers('assassin-hit', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'assassin-run',
      frames: this.anims.generateFrameNumbers('assassin-run', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: 1,
    });
  }

  #loadAssassinSprites() {
    this.load.setPath('../assets/assassin');

    this.load.spritesheet('assassin-idle', 'assassin-idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('assassin-attack', 'assassin-attack.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('assassin-special', 'assassin-special.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('assassin-hit', 'assassin-hit.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('assassin-run', 'assassin-run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.setPath('assets/');
  }

  #createMageSprites() {

    this.anims.create({
      key: 'mage-idle',
      frames: this.anims.generateFrameNumbers('mage-idle', { start: 0, end: 0 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'mage-attack',
      frames: this.anims.generateFrameNumbers('mage-attack', { start: 0, end: 6 }),
      frameRate: 16,
      repeat: 1,
    });

    this.anims.create({
      key: 'mage-special',
      frames: this.anims.generateFrameNumbers('mage-special', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'mage-hit',
      frames: this.anims.generateFrameNumbers('mage-hit', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'mage-run',
      frames: this.anims.generateFrameNumbers('mage-run', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: 1,
    });
  }

  #loadMageSprites() {
    this.load.setPath('../assets/mage');

    this.load.spritesheet('mage-idle', 'mage-idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('mage-attack', 'mage-attack.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('mage-special', 'mage-special.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('mage-hit', 'mage-hit.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('mage-run', 'mage-run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.setPath('assets/');
  }

  #createSherifSprites() {
    this.anims.create({
      key: 'sherif-idle',
      frames: this.anims.generateFrameNumbers('sherif-idle', { start: 0, end: 0 }),
      frameRate: 6,
      repeat: 1,
    });
    this.anims.create({
      key: 'sherif-attack',
      frames: this.anims.generateFrameNumbers('sherif-attack', { start: 0, end: 7 }),
      frameRate: 16,
      repeat: 1,
    });

    this.anims.create({
      key: 'sherif-special',
      frames: this.anims.generateFrameNumbers('sherif-special', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'sherif-hit',
      frames: this.anims.generateFrameNumbers('sherif-hit', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: 1,
    });

    this.anims.create({
      key: 'sherif-run',
      frames: this.anims.generateFrameNumbers('sherif-run', { start: 0, end: 7 }),
      frameRate: 13,
      repeat: 1,
    });
  }

  #loadSherifSprites() {
    this.load.setPath('../assets/sherif');

    this.load.spritesheet('sherif-idle', 'sherif-idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('sherif-attack', 'sherif-attack.png', {
      frameWidth: 42,
      frameHeight: 32,
    });
    this.load.spritesheet('sherif-special', 'sherif-special.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('sherif-hit', 'sherif-hit.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('sherif-run', 'sherif-run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.setPath('assets/');
  }
}
