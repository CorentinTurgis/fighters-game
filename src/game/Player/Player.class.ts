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
import { Game } from '../scenes/Game';

export type PlayerClass = 'assassin' | 'mage' | 'sherif' | 'bot';

export class Player {// La si on veux se faire vraiment plaisir il faudrait avoir des sous class Assassin etc pour surcharger les animations
  sprite: GameObjects.Sprite;
  name: string;
  playerClass: PlayerClass;
  playerState: ListOfAnimationKey;
  isAnimationEnded: boolean = false;
  dir: 'r' | 'l';
  hp: number;
  atk: number;

  constructor(name: string, playerClass: PlayerClass, dir: 'r' | 'l', hp: number, atk: number) {
    this.name = name;
    this.playerClass = playerClass;
    this.playerState = 'idle';
    this.hp = hp;
    this.atk = atk;
    this.dir = dir;
  }

  protected animate$(smallAnimationKey: ListOfAnimationKey): Observable<0> {
    this.isAnimationEnded = false;
    this.playerState = smallAnimationKey;
    if (this.sprite.anims) {
      this.sprite.anims.play(this.animationKey);

      const currentAnim = this.sprite.anims.currentAnim;
      if (currentAnim && smallAnimationKey !== 'idle') {
        const { duration } = currentAnim;

        return timer(duration).pipe(
          tap(() => this.isAnimationEnded = true),
          concatMap(() => this.animate$('idle')),
        );
      }
    }
    return of(0);
  }

  protected move$(delta: number) {
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

  protected run$(speed: number): Observable<any> {
    return combineLatest([
      this.animate$('run'),
      this.move$(speed),
    ]);
  }

  attack$(opponent: Player, currentTurn: FightTurn): Observable<any> {
    return this.run$(currentTurn.isHit ? 11 : 9).pipe(
      concatMap(() =>
        combineLatest([
          this.animate$('attack'),
          this.takeHit$(opponent, currentTurn),
        ])),
      tap(() => this.sprite.x = this.dir === 'r' ? 200 : 800),
    );
  }

  takeHit$(opponent: Player, currentTurn: FightTurn): Observable<0> {
    if (currentTurn && currentTurn.isHit) {
      opponent.hp = currentTurn.opponentHp;
      // Display floating text for damage
      if (currentTurn.ability === 'special') {
        opponent.showDamage(currentTurn.damage || 0, ' !!');
      } else {
        opponent.showDamage(currentTurn.damage || 0);
      }
      return opponent.animate$('hit');
    } else {
      this.showMissed();
      return of(0);
    }
  }

  protected showDamage(damage: number, extend: string = '') {
    if (this.sprite) {
      const scene = this.sprite.scene as Game; // Get the scene reference
      scene.showFloatingText(this.sprite.x + 50, this.sprite.y - 50, `-${damage}${extend}`, {
        fontSize: '50px', color: '#ff0000', fontFamily: 'DamageFont',
      });
    }
  }

  protected showMissed() {
    if (this.sprite) {
      const scene = this.sprite.scene as Game; // Get the scene reference
      scene.showFloatingText(this.sprite.x + 50, this.sprite.y - 50, `Missed`, {
        fontSize: '50px', color: '#3eada7', fontFamily: 'DamageFont',
      });
    }
  }
}