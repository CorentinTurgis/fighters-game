import { GameObjects } from 'phaser';
import { FightTurn } from '../models/Fight.model';
import { combineLatest, interval, last, Observable, of, switchMap, take, takeUntil, tap, timer } from 'rxjs';
import { ListOfAnimationKey } from '../models/ListOfAnimationKey.type';

export type PlayerClass = 'assassin' | 'mage' | 'sherif'

export class Player {
  sprite: GameObjects.Sprite;
  name: string;
  playerClass: PlayerClass;
  playerState: ListOfAnimationKey;
  isAnimationEnded: boolean = false;
  dir: 'r' | 'l';
  hp: number;
  atk: number;
  dodge: number;

  constructor(name: string, playerClass: PlayerClass, dir: 'r' | 'l', hp: number, atk: number, dodge: number) {
    this.name = name;
    this.playerClass = playerClass;
    this.playerState = 'idle';
    this.hp = hp;
    this.atk = atk;
    this.dodge = dodge;
    this.dir = dir;
  }

  #animate$(smallAnimationKey: ListOfAnimationKey) {
    console.log(smallAnimationKey)
    this.isAnimationEnded = false;
    this.playerState = smallAnimationKey;
    this.sprite.anims.play(this.animationKey);

    return timer(2000);
  }

  #move$(delta: number) {
    return interval(10).pipe(
      take(50),
      tap(() => this.sprite.x += this.dir === 'r' ? delta : -delta),
      last(),
    )
  }

  get animationKey() {
    return this.playerClass + '-' + this.playerState;
  }

  setSprite(sprite: GameObjects.Sprite): void {
    this.sprite = sprite;
  }

  #run$(): any {
    return combineLatest([
        this.#animate$('run'),
        this.#move$(10),
      ],
    );
  }

  attack$(opponent: Player, isHit: boolean): Observable<0> {
    return this.#run$().pipe(
      switchMap(() => this.#animate$('attack')),
      switchMap(() => {
        return isHit ? opponent.#animate$('hit') : of(0);
      }),
      tap(() => this.sprite.x = this.dir === 'r' ? 200 : 800),
      switchMap(() => this.#animate$('idle')),
    );
  }

  takeHit$(currentTurn?: FightTurn) {
    if (currentTurn && currentTurn.isHit) {
      this.hp -= currentTurn.opponentHp;
      return this.#animate$('hit');
    }
    return of(true);
  }
}