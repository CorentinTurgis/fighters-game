import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { Player } from '../Player/Player.class';
import { FightTurn } from '../models/Fight.model';
import { tap } from 'rxjs';
import { animateTurn } from '../utils/fight.utils';

export type ListOfAnimationKey = 'attack' | 'special' | 'hit' | 'run';
export const fight: FightTurn[] = [
  {
    attackerName: 'Bob',
    opponentName: 'Alice',
    isHit: false,
    damage: 0,
    attackerHp: 20,
    opponentHp: 20,
  },
  {
    attackerName: 'Alice',
    opponentName: 'Bob',
    isHit: true,
    damage: 0,
    attackerHp: 20,
    opponentHp: 18,
  },
  {
    attackerName: 'Bob',
    opponentName: 'Alice',
    isHit: false,
    damage: 0,
    attackerHp: 20,
    opponentHp: 20,
  },
  {
    attackerName: 'Alice',
    opponentName: 'Bob',
    isHit: true,
    damage: 0,
    attackerHp: 20,
    opponentHp: 16,
  },
];

export class Game extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  p1: Player = new Player('Bob', 'sherif', 20, 2, 0.1);
  p2: Player = new Player('Alice', 'sherif', 21, 2, 1);
  isTurnEnded: boolean = true;
  fight: FightTurn[] = fight;
  currentTurn: FightTurn | undefined = this.fight[0];

  constructor() {
    super('MainMenu');
  }

  preload() {
    this.p1.sprite = new Phaser.GameObjects.Sprite(this, 200, 600, this.p1.animationKey).setScale(4);
    this.p2.sprite = new Phaser.GameObjects.Sprite(this, 800, 600, this.p2.animationKey).setScale(4);
  }

  create() {
    this.background = this.add.image(500, 400, 'background');
    this.title = this.add.text(506, 215, 'FIGHT', {
      fontFamily: 'Arial Black', fontSize: 38, color: 'red',
      stroke: 'yellow', strokeThickness: 8,
      align: 'center',
    }).setOrigin(0.5).setDepth(100);

    this.p1.setSprite(this.add.sprite(200, 600, this.p1.animationKey).setScale(4));
    this.p2.setSprite(this.add.sprite(800, 600, this.p2.animationKey).setScale(4));
    this.p2.sprite.setFlipX(true);

    EventBus.emit('current-scene-ready', { scene: this });
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);

    if (this.currentTurn && this.isTurnEnded) {
      this.isTurnEnded = false;
      animateTurn(this.currentTurn, this.p1, this.p2).pipe(
        tap(() => {
          this.fight.shift();
          this.isTurnEnded = true;
          this.currentTurn = this.fight[0];
        })
      ).subscribe();
    }
  }
}
