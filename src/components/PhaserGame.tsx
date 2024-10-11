import { useEffect, useState } from 'react';
import Phaser from 'phaser';
import styles from './phaserGame.module.css';

interface MyScene extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys
	spacebar: Phaser.Input.Keyboard.Key,
	right: Phaser.Input.Keyboard.Key,
}

const PhaserGame: React.FC = () => {
	const [playingAnimation, setPlayingAnimation] = useState("idle")
	let corgo;
	let corgoDirection = "right";
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
			this.load.spritesheet('corgo', '/sprites/corgi-assetnotail.png', {
				frameWidth: 62,
				frameHeight: 64,
				margin: -17,
				spacing: 2
			});
		}
		function create(this: MyScene) {
			this.cursors = this.input.keyboard.createCursorKeys();
			corgo = this.physics.add.sprite(400, 300, 'corgo');
			corgo.setScale(2)
			corgo.body.setAllowGravity(true)
			corgo.setCollideWorldBounds(true);

			const create_animation = (
				scene: Phaser.Scene,
				key: string,
				start: number,
				end: number
			) => {
				scene.anims.create({
					key: key,
					frames: scene.anims.generateFrameNumbers('corgo', { start: start, end: end }),
					frameRate: 10,
					repeat: -1
				})
			}
			this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
			this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
			create_animation(this, 'jump', 2, 11)
			create_animation(this, 'idle', 26, 30)
			create_animation(this, 'sit', 38, 46)
			create_animation(this, 'walk', 50, 54)
			create_animation(this, 'run', 62, 69)
			create_animation(this, 'sniff', 74, 80)
			create_animation(this, 'sniffwalk', 86, 92)

			corgo.anims.play(playingAnimation)
		}

		function update(this: MyScene) {
			corgo.setVelocityX(0)

			if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
				corgo.setFlipX(true);
				corgo.anims.play('walk')
			}
			if (Phaser.Input.Keyboard.JustUp(this.cursors.left)) {
				corgo.anims.play('idle')
			}

			if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
				corgo.setFlipX(false);
				corgo.anims.play('walk')
			}
			if (Phaser.Input.Keyboard.JustUp(this.cursors.right)) {
				corgo.anims.play('idle')
			}
			if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
				console.log('space pressed')
			}

			if (this.cursors.left.isDown) {
				corgo.setVelocityX(-160);
				corgoDirection = "left"
			}
			if (this.cursors.right.isDown) {
				corgo.setVelocityX(160);
				corgoDirection = "right"
			}

			// if (this.cursors.up.isDown && !isJumping) {
			// 	isJumping = true;
			// 	jumpTimer = 0;
			// }
			// if (isJumping && jumpTimer <= 10) {
			//
			// 	let velocity = 2000
			// 	velocity = velocity / (jumpTimer + 1)
			// 	corgo.setVelocityY(-velocity);
			//
			// 	jumpTimer++
			// }
			//
			// if (corgo.body.touching.down) {
			// 	isJumping = false;
			// 	jumpTimer = 0;
			// }

			if (this.cursors.down.isDown) {
				corgoDirection = "down"
			}
		}

		return () => {
			game.destroy(true);
		};
	}, [playingAnimation]);
	console.log(playingAnimation)

	return <div className={styles.gameBox}>
		<div id="phaser-game"></div>
		<div className={styles.buttonBox}>
			<button onClick={() => { setPlayingAnimation("jump") }}>jump</button>
			<button onClick={() => { setPlayingAnimation("idle") }}>idle</button>
			<button onClick={() => { setPlayingAnimation("sit") }}>sit</button>
			<button onClick={() => { setPlayingAnimation("walk") }}>walk</button>
			<button onClick={() => { setPlayingAnimation("run") }}>run</button>
			<button onClick={() => { setPlayingAnimation("sniff") }}>sniff</button>
			<button onClick={() => { setPlayingAnimation("sniffwalk") }}>sniffwalk</button>
		</div>
	</div>;
};

export default PhaserGame;
