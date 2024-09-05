import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { tap, timer } from 'rxjs';

export class Win extends Scene
{
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameOverText : Phaser.GameObjects.Text;

  constructor ()
  {
    super('Win');
  }

  create ()
  {
    this.camera = this.cameras.main
    this.camera.setBackgroundColor(0xff0000);

    this.gameOverText = this.add.text(512, 384, 'YOU WIN', {
      fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5).setDepth(100);
  }
}
