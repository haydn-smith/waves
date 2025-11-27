import { rect } from 'common/factories/phaser';
import { createCallbackOnAnyEnterAndExit } from 'common/factories/state_machine';
import { CollisionTag, Sound, Sprite, TypeOfSprite } from 'constants';
import { audio } from 'systems/audio';
import { Collision, collision } from 'systems/collision';

export class Snow extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, sprite: TypeOfSprite) {
    super(scene);

    this.sprite = scene.add.sprite(0, 0, sprite);

    this.sprite.pipeline.set2f('uResolution', this.sprite.width, this.sprite.height);

    this.add([this.sprite]);

    const throwSnow = scene.add.particles(0, 0, Sprite.White1px, {
      lifespan: 300,
      speed: { min: 40, max: 60 },
      angle: { min: 180 + 45, max: 360 - 45 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, -8, 8, 8) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
      },
      gravityY: 300,
      frequency: -1,
      quantity: 30,
    });

    const interactionArea = collision(scene, rect(-4, -2, 12, 2)).notSolid();

    const shake = scene.tweens.add({
      targets: this.sprite,
      paused: true,
      persist: true,
      duration: 40,
      yoyo: true,
      repeat: 1,
      x: { from: this.sprite.x, to: this.sprite.x + 3 },
    });

    const audioKey: string = Sound.Snow2;

    const passThroughAudio = audio(scene, audioKey);

    this.on('destory', () => {
      passThroughAudio.destroy();
    });

    const states = createCallbackOnAnyEnterAndExit(scene, interactionArea, (other: Collision) => {
      if (other.hasTag(CollisionTag.ThrowsSnow)) {
        passThroughAudio.setVolume(0.3).dontLoop().play();
        throwSnow.explode();
        shake.play();
      }
    });

    this.add([interactionArea.toGameObject(), throwSnow]);
  }
}
