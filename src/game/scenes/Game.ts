import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export type Player = {
  sprite?: GameObjects.Sprite,
  class: string,
  hp: 20,
  atk: number,
  def: number,
}

export type ListOfAnimationKey = 'attack' | 'special' | 'hit' | 'run';

export class Game extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  player1: Player = { atk: 0, class: 'assassin', def: 0, hp: 20 };
  player2: Player = { atk: 0, class: 'assassin', def: 0, hp: 20 };

  constructor() {
    super('MainMenu');
  }

  preload() {
    this.player1.sprite = new Phaser.GameObjects.Sprite(this, 200, 300, 'assassin_idle').setScale(4);
    this.player2.sprite = new Phaser.GameObjects.Sprite(this, 200, 300, 'assassin_idle').setScale(4);
  }

  create() {
    this.background = this.add.image(512, 384, 'background');
    this.title = this.add.text(512, 100, 'FIGHT', {
      fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'center',
    }).setOrigin(0.5).setDepth(100);

    this.player1.sprite = this.add.sprite(200, 300, 'assassin_idle').setScale(4);
    this.player2.sprite = this.add.sprite(600, 300, 'assassin_idle').setScale(4);
    this.player2.sprite.setFlipX(true);
    this.animate(this.player1, 'run');

    EventBus.emit('current-scene-ready', { scene: this });
  }

  animate(player: Player, animationKey: ListOfAnimationKey): void {
    if (player.sprite) {
      player.sprite.anims.play(animationKey);
    }
  }

  public getPlayer1(): Player {
    return this.player1;
  }
}
