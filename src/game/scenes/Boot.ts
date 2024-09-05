import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
    this.load.image('bgDayNinja', 'assets/background/bg-day-ninja.png');
    this.load.image('bgDayDesert', 'assets/background/bg-day-desert.png');
    this.load.image('bgNightNinja', 'assets/background/bg-night-ninja.png');
    this.load.image('bgNightDeser', 'assets/background/bg-night-desert.png');
    this.load.image('bgSky', 'assets/background/bg-sky.png');
    this.load.image('bgPlain', 'assets/background/bg-plain.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
