import { GameObjects } from 'phaser';
import {
  combineLatest,
  interval,
  last,
  Observable,
  concatMap,
  of,
  take,
  tap,
  timer,
} from 'rxjs';
import { ListOfAnimationKey } from '../models/ListOfAnimationKey.type';
import { FightTurn } from '../models/Fight.model';

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

  #animate$(smallAnimationKey: ListOfAnimationKey): Observable<0> {
    this.isAnimationEnded = false;
    this.playerState = smallAnimationKey;
    this.sprite.anims.play(this.animationKey);

    const currentAnim = this.sprite.anims.currentAnim;
    console.log(currentAnim);
    if (currentAnim) {
      const { duration } = currentAnim;

      return timer(duration).pipe(
        tap(() => this.isAnimationEnded = true),
      );
    }
    return of(0);
  }

  #move$(delta: number) {
    return interval(10).pipe(
      take(50),
      tap(() => this.sprite.x += this.dir === 'r' ? delta : -delta),
      last(),
    );
  }

  get animationKey() {
    return this.playerClass + '-' + this.playerState;
  }

  setSprite(sprite: GameObjects.Sprite): void {
    this.sprite = sprite;
  }

  #run$(currentTurn: FightTurn): Observable<any> {
    return combineLatest([
      this.#animate$('run'),
      this.#move$(currentTurn.isHit ? 11 : 9),
    ]);
  }

  attack$(opponent: Player, currentTurn: FightTurn): Observable<any> {
    return this.#run$(currentTurn).pipe(
      concatMap(() =>
        combineLatest([
          this.#animate$('attack'),
          currentTurn.isHit ? opponent.#takeHit$(currentTurn) : of(0),
        ])),
      tap(() => this.sprite.x = this.dir === 'r' ? 200 : 800),
      concatMap(() => this.#animate$('idle').pipe(
        concatMap(() => of(0)),
      )),
    );
  }

  #takeHit$(currentTurn: FightTurn): Observable<0> {
    if (currentTurn && currentTurn.isHit) {
      this.hp -= currentTurn.opponentHp;
      return this.#animate$('hit').pipe(
        concatMap(() => this.#animate$('idle')),
      );
    }
    return of(0);
  }
}