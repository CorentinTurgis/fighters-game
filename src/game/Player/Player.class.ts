import { GameObjects } from 'phaser';
import { FightTurn } from '../models/Fight.model';
import { combineLatest, interval, Observable, of, switchMap, take, tap, timer } from 'rxjs';
import { ListOfAnimationKey } from '../models/ListOfAnimationKey.type';

export type PlayerClass = 'assassin' | 'mage' | 'sherif'

export class Player {
  sprite: GameObjects.Sprite;
  name: string;
  playerClass: PlayerClass;
  playerState: ListOfAnimationKey;
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
    this.playerState = smallAnimationKey;
    this.sprite.anims.play(this.animationKey);
    const frameNumber = this.sprite.anims.getTotalFrames();
    const frameTime = this.sprite.anims.msPerFrame;

    return timer(frameNumber * frameTime);
  }

  #move$(delta: number) {
    return interval(100).pipe(
      take(25),
      tap(() => {
        this.sprite.x += this.dir === 'r' ? delta : -delta;
      }),
    );
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
        this.#move$(20),
      ],
    );
  }

  attack$(opponent: Player, isHit: boolean): Observable<0> {
    return this.#run$().pipe(
      switchMap(() => this.#animate$('attack')),
      switchMap(() => isHit ? opponent.#animate$('hit') : of(0)),
      tap(() => this.sprite.x = this.dir === 'r' ? 200 : 800),
      switchMap(() => this.#animate$('idle')),
    );
  }

  takeHit$(currentTurn?: FightTurn): Observable<0> {
    if (currentTurn && currentTurn.isHit) {
      this.hp -= currentTurn.opponentHp;
      return this.#animate$('hit');
    }
    return of(0);
  }
}