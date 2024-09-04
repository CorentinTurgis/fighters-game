import { GameObjects } from 'phaser';
import { FightTurn } from '../models/Fight.model';
import { ListOfAnimationKey } from '../scenes/Game';
import { Observable, of, tap, timer } from 'rxjs';

export class Player {
  sprite: GameObjects.Sprite;
  name: string;
  playerClass: string;
  hp: number;
  atk: number;
  dodge: number;

  constructor(name: string, playerClass: string, hp: number, atk: number, dodge: number) {
    this.name = name;
    this.playerClass = playerClass;
    this.hp = hp;
    this.atk = atk;
    this.dodge = dodge;
  }

  #animate(player: Player, animationKey: ListOfAnimationKey): Observable<0> {
    player.sprite.anims.play(animationKey);

    return timer(player.sprite.anims.duration + 1000);
  }

  setSprite(sprite: GameObjects.Sprite): void {
    this.sprite = sprite;
  }

  run(): Observable<0> {
    return this.#animate(this, 'run');
  }

  attack(): Observable<0> {
    console.log('BEFORE RUN');
    return this.#animate(this, 'run').pipe(
      tap(() => {
        console.log('After run : attack');
        this.#animate(this, 'attack');
      }),
    )
  }

  takeHit(currentTurn?: FightTurn): Observable<0> {
    if (currentTurn && currentTurn.isHit) {
      console.log('outch');
      this.hp -= currentTurn.opponentHp;
      return this.#animate(this, 'hit');
    }
    return of(0)
  }
}