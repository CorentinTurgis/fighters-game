import { Scene } from 'phaser';

export class CharacterSelect extends Scene {
  constructor() {
    super('CharacterSelect');
  }

  create() {
    this.add.text(500, 100, 'Select Your Character', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const characters = [
      { name: 'assassin', key: 'assassin-idle', x: 300, y: 400 },
      { name: 'mage', key: 'mage-idle', x: 500, y: 400 },
      { name: 'sherif', key: 'sherif-idle', x: 700, y: 400 },
    ];

    characters.forEach((character) => {
      const charSprite = this.add.sprite(character.x, character.y, character.key).setScale(4).setInteractive();

      charSprite.on('pointerdown', () => {
        this.selectCharacter(character.name);
      });

      this.add.text(character.x, character.y + 80, character.name, {
        fontSize: '24px',
        color: '#ffffff',
      }).setOrigin(0.5);
    });
  }

  selectCharacter(characterName: string) {
    this.registry.set('selectedCharacter', characterName);

    this.scene.start('MainMenu');
  }
}
