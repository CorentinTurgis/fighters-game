import { Player, PlayerClass } from './Player.class';
import { FightTurn } from '../models/Fight.model';
import { combineLatest, concatMap, interval, last, Observable, of, take, tap, timer } from 'rxjs';
import { Game } from '../scenes/Game';
import { GameObjects } from 'phaser';

export class Mage extends Player {
  bullet: GameObjects.Sprite;

  constructor(name: string, playerClass: PlayerClass, dir: 'r' | 'l', hp: number, atk: number) {
    super(name, playerClass, dir, hp, atk);
  }

  override attack$(opponent: Player, currentTurn: FightTurn): Observable<any> {
    if (currentTurn.ability === 'special') {
      return this.animate$('special').pipe(
        concatMap(() => this.shoot$()),
        concatMap(() =>
          combineLatest([
            opponent.takeHit$(opponent, currentTurn),
          ])),
        tap(() => this.sprite.x = this.dir === 'r' ? 200 : 800),
      );
    }
    return super.attack$(opponent, currentTurn);
  }

  moveBullet$(delta: number) {
    return interval(10).pipe(
      take(60),
      tap(() => this.bullet.x += this.dir === 'r' ? delta : -delta),
      last(),
    );
  }


  shoot$() {
    const scene = this.sprite.scene as Game;

    if (scene) {
      this.bullet = scene.add.sprite(this.sprite.x, this.sprite.y, 'mage-bullet').setScale(3);
      this.dir === 'l' ? this.bullet.toggleFlipX() : null;
      return this.moveBullet$(10).pipe(
        tap(() => this.bullet.destroy())
      );
    }
    return of(0);
  }
}