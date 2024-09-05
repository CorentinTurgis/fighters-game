import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../Player/Player.class';
import { FightTurn } from '../models/Fight.model';
import { tap } from 'rxjs';
import { animateTurn } from '../utils/fight.utils';

export type ListOfAnimationKey = 'attack' | 'special' | 'hit' | 'run';

export class Game extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  p1: Player = new Player('Bob', 'sherif', 'r', 20, 2, 0.1);
  p2: Player = new Player('Alice', 'mage', 'l', 21, 2, 1);
  isTurnEnded: boolean = true;
  fight: FightTurn[] = [];
  currentTurn: FightTurn | undefined = this.fight[0];

  constructor() {
    super('MainMenu');
  }

  preload() {
    this.p1.sprite = new Phaser.GameObjects.Sprite(this, 200, 600, this.p1.animationKey).setScale(4);
    this.p2.sprite = new Phaser.GameObjects.Sprite(this, 800, 600, this.p2.animationKey).setScale(4);
    this.load.image('bgDayNinja', 'assets/background/bg-day-ninja.png');
    this.load.image('bgDayDesert', 'assets/background/bg-day-desert.png');
    this.load.image('bgNightNinja', 'assets/background/bg-night-ninja.png');
    this.load.image('bgNightDeser', 'assets/background/bg-night-desert.png');
    this.load.image('bgSky', 'assets/background/bg-sky.png');
    this.load.image('bgPlain', 'assets/background/bg-plain.png');
  }

  create() {
    const backgrounds = ['bgDayNinja', 'bgDayDesert', 'bgNightNinja', 'bgNightDeser', 'bgSky', 'bgPlain'];

    const randomBackground = Phaser.Math.RND.pick(backgrounds);

    this.background = this.add.image(500, 400, randomBackground);
    this.title = this.add.text(506, 215, 'FIGHT', {
      fontFamily: 'Arial Black',
      fontSize: 38,
      color: 'red',
      stroke: 'yellow',
      strokeThickness: 8,
      align: 'center',
    }).setOrigin(0.5).setDepth(100);

    this.p1.setSprite(this.add.sprite(200, 600, this.p1.animationKey).setScale(4));
    this.p2.setSprite(this.add.sprite(800, 600, this.p2.animationKey).setScale(4));
    this.p2.sprite.setFlipX(true);
    this.fight = this.cache.json.get('fight1');
    this.currentTurn = this.fight[0];

    EventBus.emit('current-scene-ready', { scene: this });
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);
  
    if (this.currentTurn && this.isTurnEnded) {
      this.isTurnEnded = false;
  
      animateTurn(this.currentTurn, this.p1, this.p2)
        .pipe(
          tap(() => {
            this.fight.shift();
            this.currentTurn = this.fight[0];
            this.isTurnEnded = true;
          })
        )
        .subscribe();
    }
  }
}