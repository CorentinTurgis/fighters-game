import { GameObjects } from 'phaser';
import { FightTurn } from '../models/Fight.model';
import { combineLatest, interval, last, Observable,concatMap,  of, switchMap, take, takeUntil, tap, timer } from 'rxjs';
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
    console.log(`Animating ${this.name} with animation: ${smallAnimationKey}`);
    this.isAnimationEnded = false;
    this.playerState = smallAnimationKey;
    this.sprite.anims.play(this.animationKey);

    const currentAnim = this.sprite.anims.currentAnim;
    if (currentAnim) {
        const totalAnimationDuration = currentAnim.duration;
        console.log(`Animation ${smallAnimationKey} duration: ${totalAnimationDuration}`);
        return timer(totalAnimationDuration).pipe(
            tap(() => {
                this.isAnimationEnded = true;
                console.log(`${smallAnimationKey} animation ended for ${this.name}`);
            }),
            switchMap(() => of(void 0))
        );
    }

    console.log(`No animation found for ${smallAnimationKey}, waiting 2 seconds.`);
    return timer(10000).pipe(
        tap(() => {
            this.isAnimationEnded = true;
            console.log(`Fallback animation ended for ${this.name}`);
        }),
        switchMap(() => of(void 0))
    );
}

  #move$(delta: number) {
    console.log(`${this.name} starts moving with delta: ${delta}`);
    return interval(10).pipe(
      take(50),
      tap(() => {
        this.sprite.x += this.dir === 'r' ? delta : -delta;
        console.log(`${this.name} position: ${this.sprite.x}`);
      }),
      last(),
      tap(() => {
        console.log(`${this.name} finished moving`);
      })
    );
  }

  get animationKey() {
    return this.playerClass + '-' + this.playerState;
  }

  setSprite(sprite: GameObjects.Sprite): void {
    this.sprite = sprite;
    console.log(`Sprite set for ${this.name}`);
  }

  #run$(): Observable<any> {
    console.log(`${this.name} starts running`);
    return combineLatest([this.#animate$('run'), this.#move$(10)]).pipe(
      tap(() => {
        console.log(`${this.name} run completed`);
      })
    );
  }

  attack$(opponent: Player, isHit: boolean): Observable<any> {
    console.log(`${this.name} is attacking ${opponent.name}. Is hit: ${isHit}`);
    return this.#run$().pipe(
      concatMap(() => this.#animate$('attack')), 
      concatMap(() => {
        if (isHit) {
          console.log(`${opponent.name} is hit by ${this.name}`);
          return opponent.#animate$('hit').pipe(
            concatMap(() => of(0))  
          );
        } else {
          console.log(`${opponent.name} dodged the attack`);
          return of(0);
        }
      }),
      tap(() => {
        this.sprite.x = this.dir === 'r' ? 200 : 800;
        console.log(`${this.name} returns to starting position: ${this.sprite.x}`);
      }),
      concatMap(() => this.#animate$('idle').pipe(
        concatMap(() => of(0))
      )),
      tap(() => {
        console.log(`${this.name} idle after attack`);
      })
    );
  }

  takeHit$(currentTurn?: FightTurn): Observable<boolean> {
    if (currentTurn && currentTurn.isHit) {
      console.log(`${this.name} takes a hit. HP before: ${this.hp}`);
      this.hp -= currentTurn.opponentHp;
      console.log(`${this.name} HP after: ${this.hp}`);
      return this.#animate$('hit').pipe(
        concatMap(() => of(true))
      );
    }
    return of(true);
  }
}