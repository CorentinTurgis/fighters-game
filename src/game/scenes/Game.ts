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
    this.load.image('bgDayNinja', 'assets/background/bg-day-ninja.png');
    this.load.image('bgDayDesert', 'assets/background/bg-day-desert.png');
    this.load.image('bgNightNinja', 'assets/background/bg-night-ninja.png');
    this.load.image('bgNightDeser', 'assets/background/bg-night-desert.png');
    this.load.image('bgSky', 'assets/background/bg-sky.png');
    this.load.image('bgPlain', 'assets/background/bg-plain.png');
    this.load.image('healthBar', 'assets/gameplay/health-bar.png');
  }

  create() {
    const backgrounds = ['bgDayNinja', 'bgDayDesert', 'bgNightNinja', 'bgNightDeser', 'bgSky', 'bgPlain'];
    const randomBackground = Phaser.Math.RND.pick(backgrounds);

    const selectedCharacter = this.registry.get('selectedCharacter') || 'assassin';
    this.p1 = this.createPlayer('Bob', selectedCharacter, 'r', 20, 2, 200, 600);
    this.p2 = this.createPlayer('Alice', 'mage', 'l', 21, 2, 800, 600);  // Joueur 2 par défaut pour l'exemple

    this.background = this.add.image(500, 400, randomBackground);
    this.title = this.add.text(500, 100, 'FIGHT', {
      fontFamily: 'VT323',
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
  
    if (!this.p1 || !this.p2 || !this.fight.length) {
      return; // Wait until players and fight data are ready
    }
  
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
    const barWidth = 340;
    const barHeight = 10;
  
    this.p1HealthBar = this.add.graphics();
    this.p1HealthBar.fillStyle(0x00ff00, 1);
    this.p1HealthBar.fillRect(80, 30, barWidth, barHeight);
  
    const healthBarP1 = this.add.image(260, 40, 'healthBar').setOrigin(0.5, 0.5);
    healthBarP1.setScale(3);
  
    this.p2HealthBar = this.add.graphics();
    this.p2HealthBar.fillStyle(0x00ff00, 1);
    this.p2HealthBar.fillRect(this.cameras.main.width - 360, 30, barWidth, barHeight);
  
    const healthBarP2 = this.add.image(this.cameras.main.width - 260, 40, 'healthBar').setOrigin(0.5, 0.5);
    healthBarP2.setScale(3);
    healthBarP2.setFlipX(true);
  }
  
  updateP1HealthBar(currentHp: number, maxHp: number): void {
    const barWidth = 340;  // Largeur de la barre de vie
    const barHeight = 10;
  
    // Calcul du pourcentage de vie
    const healthPercentage = currentHp / maxHp;
    const adjustedWidth = barWidth * healthPercentage;
  
    // Mise à jour graphique
    this.p1HealthBar.clear();
    this.p1HealthBar.fillStyle(healthPercentage > 0.5 ? 0x00ff00 : 0xff0000, 1);  // Vert > 50%, Rouge < 50%
    this.p1HealthBar.fillRect(80, 30, adjustedWidth, barHeight);  // Ajustement de la largeur selon la vie
  }
  
  updateP2HealthBar(currentHp: number, maxHp: number): void {
    const barWidth = 340;  // Largeur de la barre de vie
    const barHeight = 10;  // Hauteur de la barre de vie
  
    // Calcul du pourcentage de vie
    const healthPercentage = currentHp / maxHp;
    const adjustedWidth = barWidth * healthPercentage;
  
    // Mise à jour graphique
    this.p2HealthBar.clear();
    this.p2HealthBar.fillStyle(healthPercentage > 0.5 ? 0x00ff00 : 0xff0000, 1);  // Vert > 50%, Rouge < 50%
    this.p2HealthBar.fillRect(this.cameras.main.width - 380 + (barWidth - adjustedWidth), 30, adjustedWidth, barHeight);
  }
  
  createPlayer(reelName:string, characterName: string, direction: string, hp: number, attack: number, x: number, y: number): Player {
    const validDirection = direction === 'r' || direction === 'l' ? direction : 'r';
  
    switch (characterName) {
      case 'assassin':
        return new Assassin(reelName, 'assassin', validDirection, hp, attack);
      case 'mage':
        return new Player(reelName, 'mage', validDirection, hp, attack);
      case 'sherif':
        return new Player(reelName, 'sherif', validDirection, hp, attack);
      default:
        return new Assassin(reelName, 'assassin', validDirection, hp, attack);
    }
  }
}