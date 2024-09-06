import { Scene } from 'phaser';

export class CharacterSelect extends Scene {
  constructor() {
    super('CharacterSelect');
  }

  create() {
    this.add.text(500, 100, 'SELECT YOUR CHARACTER', {
      fontFamily: 'VT323',
      fontSize: 38,
      color: 'red',
      stroke: 'yellow',
      strokeThickness: 8,
      align: 'center',
    }).setOrigin(0.5).setDepth(100);

    // Ajout de statistiques pour chaque personnage
    const characters = [
      { name: 'assassin', key: 'assassin-idle', hp: 100, atk: 20, x: 250, y: 400 },
      { name: 'mage', key: 'mage-idle', hp: 80, atk: 30, x: 500, y: 400 },
      { name: 'sherif', key: 'sherif-idle', hp: 120, atk: 15, x: 750, y: 400 },
    ];

    characters.forEach((character) => {
      // Sprite interactif pour chaque personnage
      const charSprite = this.add.sprite(character.x, character.y, character.key).setScale(4).setInteractive();
      const camelCaseName = character.name.charAt(0).toUpperCase() + character.name.slice(1).toLowerCase();

      // Espacement ajusté pour le nom et les stats
      const nameText = this.add.text(character.x, character.y + 100, camelCaseName, {
        fontFamily: 'VT323',
        fontSize: '24px',
        color: '#ffffff',
      }).setOrigin(0.5);

      const statsText = this.add.text(character.x, character.y + 140, `HP: ${character.hp} | ATK: ${character.atk}`, {
        fontFamily: 'VT323',
        fontSize: '20px',
        color: '#ffffff',
      }).setOrigin(0.5);

      // Effet de hover (agrandir le sprite, le nom et les stats)
      charSprite.on('pointerover', () => {
        charSprite.setScale(4.5); // Agrandir le sprite
        nameText.setFontSize(28); // Agrandir le texte du nom
        statsText.setFontSize(24); // Agrandir le texte des stats
        statsText.setColor('#ffff00'); // Changer la couleur des stats à jaune
      });

      // Retirer l'effet de hover
      charSprite.on('pointerout', () => {
        charSprite.setScale(4); // Revenir à la taille normale du sprite
        nameText.setFontSize(24); // Revenir à la taille normale du nom
        statsText.setFontSize(20); // Revenir à la taille normale des stats
        statsText.setColor('#ffffff'); // Revenir à la couleur d'origine des stats
      });

      // Sélection du personnage
      charSprite.on('pointerdown', () => {
        this.selectCharacter(character.name);
      });
    });
  }

  selectCharacter(characterName: string) {
    this.registry.set('selectedCharacter', characterName);
    this.scene.start('MainMenu');
  }
}
