import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../Player/Player.class';
import { FightTurn } from '../models/Fight.model';
import { tap } from 'rxjs';
import { animateTurn } from '../utils/fight.utils';
import { Assassin } from '../Player/Assassin.class';

export class Game extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  p1: Player = new Assassin('Bob', 'assassin', 'r', 20, 2);
  p2: Player = new Player('Alice', 'mage', 'l', 21, 2);
  p1HealthBar: GameObjects.Graphics;
  p2HealthBar: GameObjects.Graphics;
  isTurnEnded: boolean = true;
  fight: FightTurn[] = [];
  currentTurn: FightTurn | undefined = this.fight[0];

  constructor() {
    super('MainMenu');
  }

  preload() {
    this.p1.sprite = new Phaser.GameObjects.Sprite(this, 200, 600, this.p1.animationKey).setScale(4);
    this.p2.sprite = new Phaser.GameObjects.Sprite(this, 800, 600, this.p2.animationKey).setScale(4);
    this.load.image('bgDayNinja', 'assets/background/bg-day-ninja.png');
    this.load.image('bgDayDesert', 'assets/background/bg-day-desert.png');
    this.load.image('bgNightNinja', 'assets/background/bg-night-ninja.png');
    this.load.image('bgNightDeser', 'assets/background/bg-night-desert.png');
    this.load.image('bgSky', 'assets/background/bg-sky.png');
    this.load.image('bgPlain', 'assets/background/bg-plain.png');
  }

  create() {
    const backgrounds = ['bgDayNinja', 'bgDayDesert', 'bgNightNinja', 'bgNightDeser', 'bgSky', 'bgPlain'];
    const randomBackground = Phaser.Math.RND.pick(backgrounds);

    this.background = this.add.image(500, 400, randomBackground);
    this.title = this.add.text(506, 215, 'FIGHT', {
      fontFamily: 'Arial Black',
      fontSize: 38,
      color: 'red',
      stroke: 'yellow',
      strokeThickness: 8,
      align: 'center',
    }).setOrigin(0.5).setDepth(100);

    this.p1.setSprite(this.add.sprite(200, 600, this.p1.animationKey).setScale(4));
    this.p2.setSprite(this.add.sprite(800, 600, this.p2.animationKey).setScale(4));
    this.p2.sprite.setFlipX(true);
    this.createHealthBars();
    this.fight = this.cache.json.get('fight1');
    this.currentTurn = this.fight[0];

    EventBus.emit('current-scene-ready', { scene: this });
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);
  
    if (this.currentTurn && this.isTurnEnded) {
      this.isTurnEnded = false;
  
      animateTurn(this.currentTurn, this.p1, this.p2)
        .pipe(
          tap(() => {
            this.fight.shift();
            this.currentTurn = this.fight[0];
            this.isTurnEnded = true;
          })
        )
        .subscribe();
      this.updateP1HealthBar(this.p1.hp, 20);
      this.updateP2HealthBar(this.p2.hp, 20);
    } else {
      if (this.p1.hp <= 0)
        this.scene.start('GameOver');
      else if (this.p2.hp <= 0)
        this.scene.start('Win');
    }
  }

  showFloatingText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): void {
    const floatingText = this.add.text(x, y, text, style).setOrigin(0.5);

    // Tween to make the text float upwards and fade out
    this.tweens.add({
      targets: floatingText,   // Target the text object
      y: y - 50,               // Move upwards by 50px
      alpha: 0,                // Fade out the text
      ease: 'Power1',          // Easing function
      duration: 1000,          // Duration of 1 second
      onComplete: () => {
        floatingText.destroy();  // Destroy the text object after animation
      }
    });
  }

  createHealthBars(): void {
    // Player 1 health bar (top left)
    this.p1HealthBar = this.add.graphics();
    this.p1HealthBar.fillStyle(0x00ff00, 1);  // Green color for full health
    this.p1HealthBar.fillRect(20, 20, 400, 40);  // Initial size of the health bar

    // Player 2 health bar (top right)
    this.p2HealthBar = this.add.graphics();
    this.p2HealthBar.fillStyle(0x00ff00, 1);  // Green color for full health
    this.p2HealthBar.fillRect(this.cameras.main.width - 220, 20, 400, 40);  // Initial size of the health bar
  }

  updateP1HealthBar(currentHp: number, maxHp: number): void {
    this.p1HealthBar.clear();
    const healthPercentage = currentHp / maxHp;
    const barWidth = 400 * healthPercentage;  // Scale bar width based on health percentage

    // Redraw health bar
    this.p1HealthBar.fillStyle(healthPercentage > 0.5 ? 0x00ff00 : 0xff0000, 1);  // Green if > 50% health, red if <= 50%
    this.p1HealthBar.fillRect(20, 20, barWidth, 40);
  }

  updateP2HealthBar(currentHp: number, maxHp: number): void {
    this.p2HealthBar.clear();
    const healthPercentage = currentHp / maxHp;
    const barWidth = 400 * healthPercentage;

    // Redraw health bar
    this.p2HealthBar.fillStyle(healthPercentage > 0.5 ? 0x00ff00 : 0xff0000, 1);  // Green if > 50% health, red if <= 50%
    this.p2HealthBar.fillRect(this.cameras.main.width - 20 - barWidth, 20, barWidth, 40);
  }

}