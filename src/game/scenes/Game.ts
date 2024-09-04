import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { Player } from '../Player/Player.class';
import { FightTurn } from '../models/Fight.model';
import { switchMap, tap, timer } from 'rxjs';

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
  Bob: Player = new Player('Bob', 'assassin', 20, 2, 0.1);
  Alice: Player = new Player('Alice', 'assassin', 21, 2, 1);
  isTurnEnded: boolean = true;
  fight: FightTurn[] = fight;
  currentTurn: FightTurn | undefined = this.fight[0];

  constructor() {
    super('MainMenu');
  }

  preload() {
    this.Bob.sprite = new Phaser.GameObjects.Sprite(this, 200, 300, 'assassin_idle').setScale(4);
    this.Alice.sprite = new Phaser.GameObjects.Sprite(this, 200, 300, 'assassin_idle').setScale(4);
  }

  create() {
    this.background = this.add.image(512, 384, 'background');
    this.title = this.add.text(512, 100, 'FIGHT', {
      fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'center',
    }).setOrigin(0.5).setDepth(100);

    this.Bob.setSprite(this.add.sprite(200, 300, 'assassin_idle').setScale(4));
    this.Alice.setSprite(this.add.sprite(600, 300, 'assassin_idle').setScale(4));
    this.Alice.sprite.setFlipX(true);

    EventBus.emit('current-scene-ready', { scene: this });
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);

    if (this.currentTurn && this.isTurnEnded) {
      this.isTurnEnded = false;
      const { opponentName, attackerName } = this.currentTurn;

      this.getPlayerByName(attackerName).attack()
        .pipe(
          switchMap(() => {
            return this.getPlayerByName(opponentName).takeHit(this.currentTurn);
          }),
          switchMap(() => {
            this.fight.shift();
            return timer(2000).pipe(
              tap(() => {
                this.isTurnEnded = true;
                this.currentTurn = this.fight[0];
              })
            )
          })
        ).subscribe();
    }
  }

  getPlayerByName(name: string): Player {
    return this.Bob.name === name ? this.Bob
      : this.Alice;
  }
}
