import { useEffect } from 'react';
import Phaser from 'phaser';
import styles from './phaserGame.module.css';

interface MyScene extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys
	spacebar: Phaser.Input.Keyboard.Key,
	right: Phaser.Input.Keyboard.Key,
	up: Phaser.Input.Keyboard.Key,
}

const PhaserGame: React.FC = () => {
	let corgo: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	let corgoDirection = "right";
	let isJumping = false;
	let jumpTimer = 0;
	let background1: Phaser.GameObjects.TileSprite;
	let background2: Phaser.GameObjects.TileSprite;
	let background3: Phaser.GameObjects.TileSprite;
	let background4: Phaser.GameObjects.TileSprite;
	let background5: Phaser.GameObjects.TileSprite;
	useEffect(() => {
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: 800,
			height: 600,
			parent: 'phaser-game',
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { x: 0, y: 300 }
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
			this.load.image('hills01', '/backgrounds/hills/HillsLayer01.png')
			this.load.image('hills02', '/backgrounds/hills/HillsLayer02.png')
			this.load.image('hills03', '/backgrounds/hills/HillsLayer03.png')
			this.load.image('hills04', '/backgrounds/hills/HillsLayer04.png')
			this.load.image('hills05', '/backgrounds/hills/HillsLayer05.png')
			this.load.spritesheet('corgo', '/sprites/corgi-assetnotail.png', {
				frameWidth: 62,
				frameHeight: 64,
				margin: -17,
				spacing: 2
			});
		}
		function create(this: MyScene) {

			background1 = addBackground("hills01", 0, 0, 400, 300, this)
			background2 = addBackground("hills02", 0, 0, 400, 300, this)
			background3 = addBackground("hills03", 0, 0, 400, 300, this)
			background4 = addBackground("hills04", 0, 0, 400, 300, this)
			background5 = addBackground("hills05", 0, 0, 400, 300, this)

			this.cursors = this.input.keyboard.createCursorKeys();
			corgo = this.physics.add.sprite(400, 600, 'corgo');
			corgo.setScale(2)
			corgo.body.setAllowGravity(true)
			corgo.body.setGravity(0)
			corgo.setCollideWorldBounds(true);
			corgo.body.onWorldBounds = true;

			const create_animation = (
				scene: Phaser.Scene,
				key: string,
				start: number,
				end: number,
				repeat: number = -1
			) => {
				scene.anims.create({
					key: key,
					frames: scene.anims.generateFrameNumbers('corgo', { start: start, end: end }),
					frameRate: 10,
					repeat: repeat
				})
			}
			this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
			this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
			this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
			create_animation(this, 'jump', 2, 11, 0)
			create_animation(this, 'idle', 26, 30)
			create_animation(this, 'sit', 38, 46, 0)
			create_animation(this, 'sitIdle', 44, 46)
			create_animation(this, 'walk', 50, 54)
			create_animation(this, 'run', 62, 69)
			create_animation(this, 'sniff', 74, 80)
			create_animation(this, 'sniffwalk', 86, 92)

			corgo.anims.play('idle')
			function addBackground(background: string, posx: number, posy: number, width: number, height: number, scene: Phaser.Scene): Phaser.GameObjects.TileSprite {
				const bg = scene.add.tileSprite(posx, posy, width, height, background).setOrigin(0)
					.setScrollFactor(1)
				bg.setScale(2)


				return bg
			}
		}
		function update(this: MyScene) {
			corgo.setVelocityX(0)
			function updateSceneRight() {
				background1.tilePositionX += 0.1
				background2.tilePositionX += 0.5
				background3.tilePositionX += 0.6
				background4.tilePositionX += 0.7
				background5.tilePositionX += 0.8
			}
			function updateSceneLeft() {
				background1.tilePositionX -= 0.1
				background2.tilePositionX -= 0.5
				background3.tilePositionX -= 0.6
				background4.tilePositionX -= 0.7
				background5.tilePositionX -= 0.8
			}

			if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
				corgo.setFlipX(true);
			}

			if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
				corgo.setFlipX(false);
			}
			if (this.cursors.left.isDown) {
				updateSceneLeft()
				corgoDirection = "left"
				if (corgo.anims.currentAnim?.key !== 'walk' && corgo.body.onFloor()) {
					corgo.anims.play('walk');
				}
			}
			if (this.cursors.right.isDown) {
				updateSceneRight()
				corgoDirection = "right"
				if (corgo.anims.currentAnim?.key !== 'walk' && corgo.body.onFloor()) {
					corgo.anims.play('walk');
				}
			}

			if (this.cursors.up.isDown && !isJumping && corgo.body.onFloor()) {
				isJumping = true;
				jumpTimer = 0;
				corgo.setVelocityY(-200);
				corgo.anims.play('jump')
			}
			if (isJumping) {
				console.log(isJumping)
				if (isJumping) {
					corgo.anims.play('jump');
				}
			}

			if (corgo.body.onFloor() && isJumping) {
				isJumping = false;
				jumpTimer = 0;
			}

			//no buttons pressed & on floor & not jumping & not sitting = idle
			if (
				!this.cursors.left.isDown
				&& !this.cursors.right.isDown
				&& !this.cursors.down.isDown
				&& !this.cursors.up.isDown
				&& corgo.body.onFloor()
				&& !isJumping
				&& corgo.anims.currentAnim?.key !== 'sitIdle'
				&& corgo.anims.currentAnim?.key !== 'sit'
			) {
				if (corgo.anims.currentAnim?.key !== 'idle') {
					corgo.anims.play('idle')
				}
			}

			//on the floor & down is pressed = sit
			if (this.cursors.down.isDown && corgo.body.onFloor()) {
				if (corgo.anims.currentAnim?.key !== 'sit') {
					corgo.anims.play('sit')
					corgo.anims.playAfterDelay('sitIdle', 500)
				}
			}
		}

		return () => {
			game.destroy(true);
		};
	}, []);

	return <div id="phaser-game"></div>
};

export default PhaserGame;
