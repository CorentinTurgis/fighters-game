import { Scene } from 'phaser';
import { ListOfAnimationKey } from '../models/ListOfAnimationKey.type';
import { PlayerClass } from '../Player/Player.class';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {

    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'bg');
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
    this.#loadSprites();
    this.load.json('fight1', 'fight1.json');
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    this.#createAssassinSprites();
    this.#createMageSprites();
    this.#createSherifSprites();
    this.#createBotSprites();
    this.scene.start('CharacterSelect');
  }

  #loadSprites() {
    const animKeys: ListOfAnimationKey[] = ['attack', 'special', 'hit', 'run', 'idle'];
    const classList: PlayerClass[] = ['assassin', 'mage', 'sherif', 'bot'];

    classList.forEach((className) => {
      this.load.setPath(`../assets/${className}`);
      animKeys.forEach((key) => {
        this.load.spritesheet({
          key: `${className}-${key}`,
          url: `${className}-${key}.png`,
          frameConfig: {
            frameWidth: `${className}-${key}` !== 'sherif-attack' ? 32 : 42,
            frameHeight: 32,
          },
        });
      });
    });
    this.load.setPath('../assets');
    this.load.spritesheet({
      key: 'mage-bullet',
      url: 'mage/mage-bullet.png',
      frameConfig: {
        frameWidth: 32,
        frameHeight: 32,
      },
    });
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
      frameRate: 15,
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

  #createMageSprites() {
    this.anims.create({
      key: 'mage-idle',
      frames: this.anims.generateFrameNumbers('mage-idle', { start: 0, end: 0 }),
      frameRate: 50,
      repeat: 1,
    });

    this.anims.create({
      key: 'mage-attack',
      frames: this.anims.generateFrameNumbers('mage-attack', { start: 0, end: 6 }),
      frameRate: 16,
    });

    this.anims.create({
      key: 'mage-special',
      frames: this.anims.generateFrameNumbers('mage-special', { start: 0, end: 3 }),
      frameRate: 6,
    });

    this.anims.create({
      key: 'mage-bullet',
      frames: this.anims.generateFrameNumbers('mage-bullet', { start: 0, end: 9 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: 'mage-hit',
      frames: this.anims.generateFrameNumbers('mage-hit', { start: 0, end: 2 }),
      frameRate: 6,
    });

    this.anims.create({
      key: 'mage-run',
      frames: this.anims.generateFrameNumbers('mage-run', { start: 0, end: 7 }),
      frameRate: 14,
    });
  }

  #createBotSprites() {
    this.anims.create({
      key: 'bot-idle',
      frames: this.anims.generateFrameNumbers('bot-idle', { start: 0, end: 0 }),
      frameRate: 50,
      repeat: 1,
    });

    this.anims.create({
      key: 'bot-attack',
      frames: this.anims.generateFrameNumbers('bot-attack', { start: 0, end: 7 }),
      frameRate: 16,
    });

    this.anims.create({
      key: 'bot-hit',
      frames: this.anims.generateFrameNumbers('bot-hit', { start: 0, end: 3 }),
      frameRate: 6,
    });

    this.anims.create({
      key: 'bot-run',
      frames: this.anims.generateFrameNumbers('bot-run', { start: 0, end: 6 }),
      frameRate: 14,
    });
  }

  #createSherifSprites() {
    this.anims.create({
      key: 'sherif-idle',
      frames: this.anims.generateFrameNumbers('sherif-idle', { start: 0, end: 0 }),
      frameRate: 50,
      repeat: 1,
    });
    this.anims.create({
      key: 'sherif-attack',
      frames: this.anims.generateFrameNumbers('sherif-attack', { start: 0, end: 7 }),
      frameRate: 16,
    });

    this.anims.create({
      key: 'sherif-special',
      frames: this.anims.generateFrameNumbers('sherif-special', { start: 0, end: 7 }),
      frameRate: 6,
    });

    this.anims.create({
      key: 'sherif-hit',
      frames: this.anims.generateFrameNumbers('sherif-hit', { start: 0, end: 3 }),
      frameRate: 6,
    });

    this.anims.create({
      key: 'sherif-run',
      frames: this.anims.generateFrameNumbers('sherif-run', { start: 0, end: 7 }),
      frameRate: 13,
    });
  }
}