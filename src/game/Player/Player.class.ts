import { GameObjects } from 'phaser';
import { FightTurn } from '../models/Fight.model';
import { combineLatest, interval, last, Observable, concatMap, of, switchMap, take, takeUntil, tap, timer } from 'rxjs';
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

  #animate$(smallAnimationKey: ListOfAnimationKey): Observable<void> {
    this.isAnimationEnded = false;
    this.playerState = smallAnimationKey;
    this.sprite.anims.play(this.animationKey);

    const currentAnim = this.sprite.anims.currentAnim;
    if (currentAnim) {
      const totalAnimationDuration = currentAnim.duration;

      return timer(totalAnimationDuration).pipe(
        tap(() => {
          this.isAnimationEnded = true;
        }),
        switchMap(() => of(void 0)),
      );
    }

    return timer(10000).pipe(
      tap(() => {
        this.isAnimationEnded = true;
      }),
      switchMap(() => of(void 0)),
    );
  }

  #move$(delta: number) {
    return interval(10).pipe(
      take(50),
      tap(() => {
        this.sprite.x += this.dir === 'r' ? delta : -delta;
      }),
      last(),
    );
  }

  get animationKey() {
    return this.playerClass + '-' + this.playerState;
  }

  setSprite(sprite: GameObjects.Sprite): void {
    this.sprite = sprite;
  }

  #run$(): Observable<any> {
    return combineLatest([this.#animate$('run'), this.#move$(10)]);
  }

  attack$(opponent: Player, isHit: boolean): Observable<any> {
    return this.#run$().pipe(
      concatMap(() => this.#animate$('attack')),
      concatMap(() => {
        if (isHit) {
          return opponent.#animate$('hit').pipe(
            concatMap(() => of(0)),
          );
        } else {
          return of(0);
        }
      }),
      tap(() => {
        this.sprite.x = this.dir === 'r' ? 200 : 800;
      }),
      concatMap(() => this.#animate$('idle').pipe(
        concatMap(() => of(0)),
      )),
    );
  }

  takeHit$(currentTurn?: FightTurn): Observable<boolean> {
    if (currentTurn && currentTurn.isHit) {
      this.hp -= currentTurn.opponentHp;
      return this.#animate$('hit').pipe(
        concatMap(() => of(true)),
      );
    }
    return of(true);
  }
}