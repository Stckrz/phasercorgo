import { useEffect } from 'react';
import Phaser from 'phaser';

const PhaserGame: React.FC = () => {
	useEffect(() => {
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: 800,
			height: 600,
			parent: 'phaser-game',
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { x: 0, y: 200 }
				}
			},
			scene: {
				preload: preload,
				create: create,
				update: update
			}
		};

		const game = new Phaser.Game(config);
		function preload(this: Phaser.Scene) {
			// this.load.image('corgo', '/sprites/corgi-assetnotail.png')
			this.load.spritesheet('corgo', '/sprites/corgi-assetnotail.png', {
				frameWidth: 62,
				frameHeight: 64,
				margin: -17,
				spacing: 2
			});
		}

		function create(this: Phaser.Scene) {
			const corgo = this.physics.add.sprite(200, 100, 'corgo');
			corgo.setScale(2)
			corgo.body.setAllowGravity(false)
			this.anims.create({
				key: 'jump',
				frames: this.anims.generateFrameNumbers('corgo', {start: 1, end: 12}),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'idle',
				frames: this.anims.generateFrameNumbers('corgo', {start: 26, end: 30}),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'sit',
				frames: this.anims.generateFrameNumbers('corgo', {start: 38, end: 46}),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'walk',
				frames: this.anims.generateFrameNumbers('corgo', {start: 50, end: 54}),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'run',
				frames: this.anims.generateFrameNumbers('corgo', {start: 62, end: 69}),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'sniff',
				frames: this.anims.generateFrameNumbers('corgo', {start: 73, end: 80}),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'sniffwalk',
				frames: this.anims.generateFrameNumbers('corgo', {start: 85, end: 92}),
				frameRate: 10,
				repeat: -1
			});
			corgo.anims.play('sniffwalk')
		}

		function update() { }

		return () => {
			game.destroy(true);
		};
	}, []);

	return <div id="phaser-game"></div>;
};

export default PhaserGame;
