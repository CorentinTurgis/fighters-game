window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);

    function preload() {
        this.load.image('background', 'assets/background.jpg');

        this.load.image('assasin-idle', 'assets/idle-assasin.png');

        this.load.spritesheet('assasin-attack', 'assets/attack-assasin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('assasin-special', 'assets/special-assasin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('assasin-hit', 'assets/hit-assasin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('assasin-run', 'assets/run-assasin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    function create() {
        this.add.image(400, 300, 'background');

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('assasin-attack', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'special',
            frames: this.anims.generateFrameNumbers('assasin-special', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'hit',
            frames: this.anims.generateFrameNumbers('assasin-hit', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('assasin-run', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.player1 = this.add.sprite(200, 300, 'assasin-idle').setScale(4);
        this.player2 = this.add.sprite(600, 300, 'assasin-idle').setScale(4);

        this.player1.anims.play('run');
        this.player2.anims.play('run');
        
        this.player2.setFlipX(true);

        this.player1.health = 100;
        this.player2.health = 100;
    }

    function update() {
        if (Phaser.Math.Between(0, 100) < 1) {
            this.player1.anims.play('attack', true);
            this.player2.health -= Phaser.Math.Between(5, 15);
        }

        if (Phaser.Math.Between(0, 100) < 1) {
            this.player2.anims.play('attack', true);
            this.player1.health -= Phaser.Math.Between(5, 15);
        }

        if (Phaser.Math.Between(0, 200) < 1) {
            this.player1.anims.play('special', true);
            this.player2.health -= Phaser.Math.Between(15, 30);
        }

        if (Phaser.Math.Between(0, 200) < 1) {
            this.player2.anims.play('special', true);
            this.player1.health -= Phaser.Math.Between(15, 30);
        }

        if (this.player1.health <= 0) {
            this.player1.anims.play('hit', true);
        }

        if (this.player2.health <= 0) {
            this.player2.anims.play('hit', true);
        }
    }
};