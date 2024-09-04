import { GameObjects } from 'phaser';
import { FightTurn } from '../models/Fight.model';
import { Observable, of, tap, timer } from 'rxjs';
import { ListOfAnimationKey } from '../models/ListOfAnimationKey.type';

export type PlayerClass = 'assassin' | 'mage' | 'sherif'

export class Player {
  sprite: GameObjects.Sprite;
  name: string;
  playerClass: PlayerClass;
  playerState: ListOfAnimationKey;
  hp: number;
  atk: number;
  dodge: number;

  constructor(name: string, playerClass: PlayerClass, hp: number, atk: number, dodge: number) {
    this.name = name;
    this.playerClass = playerClass;
    this.playerState = 'idle';
    this.hp = hp;
    this.atk = atk;
    this.dodge = dodge;
  }

  #animate(player: Player, smallAnimationKey: ListOfAnimationKey): Observable<0> {
    player.playerState = smallAnimationKey;
    player.sprite.anims.play(player.animationKey);

    return timer(player.sprite.anims.duration + 1000);
  }

  get animationKey() {
    return this.playerClass + '-' + this.playerState;
  }

  setSprite(sprite: GameObjects.Sprite): void {
    this.sprite = sprite;
  }

  run(): Observable<0> {
    return this.#animate(this, 'run');
  }

  attack(): Observable<0> {
    return this.#animate(this, 'run').pipe(
      tap(() => this.#animate(this, 'attack')),
    )
  }

  takeHit(currentTurn?: FightTurn): Observable<0> {
    if (currentTurn && currentTurn.isHit) {
      this.hp -= currentTurn.opponentHp;
      return this.#animate(this, 'hit');
    }
    return of(0)
  }
}