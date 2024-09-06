import { Player, PlayerClass } from './Player.class';
import { FightTurn } from '../models/Fight.model';
import { combineLatest, concatMap, Observable, of, tap, timer } from 'rxjs';

export class Assassin extends Player {
  constructor(name: string, playerClass: PlayerClass, dir: 'r' | 'l', hp: number, atk: number) {
    super(name, playerClass, dir, hp, atk);
  }

  override attack$(opponent: Player, currentTurn: FightTurn): Observable<any> {
    if (currentTurn.ability === 'special') {
      return this.run$(4).pipe(
        tap(() => this.animate$('idle')),
        tap(() => this.sprite.x = this.dir === 'r' ? 890 : 100),
        concatMap(() => timer(450)),
        concatMap(() =>
          combineLatest([
            this.animate$('special'),
            opponent.takeHit$(opponent, currentTurn),
          ])),
        tap(() => this.sprite.x = this.dir === 'r' ? 200 : 800),
      );
    }
    return super.attack$(opponent, currentTurn);
  }
}