import { rect, vec2 } from 'common/factories/phaser';
import { Animation, Depth, Sound, Sprite } from 'constants';
import { spatialAudio, SpatialAudio } from 'systems/audio';
import { Collision, collision } from 'systems/collision';

export class Jetty extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;

  public tiledSprite: Phaser.GameObjects.TileSprite;

  public waves: Phaser.GameObjects.Sprite;

  private collisions: Collision[];

  private wavesAudio: SpatialAudio;

  constructor(scene: Phaser.Scene) {
    const tiledSprite = scene.add.tileSprite(120, 0, 320, 480, Sprite.Waves).setDepth(Depth.Background - 1);

    super(scene);

    this.wavesAudio = spatialAudio(scene, Sound.Waves)
      .setDistance(200)
      .setPosition(vec2(32, 0))
      .setVolume(0)
      .loop()
      .play();

    scene.tweens
      .add({
        targets: this.wavesAudio,
        props: {
          volume: { from: 0, to: 0.8 },
        },
        duration: 3000,
        onUpdate: (_tween, _target, _key, current) => {
          this.wavesAudio.setVolume(current);
        },
      })
      .play();

    this.sprite = scene.add.sprite(-2, 0, Sprite.Jetty);

    this.sprite.anims.play(Animation.Jetty);

    const cliffTop = scene.add.sprite(-29, -111, Sprite.CliffTop);
    const cliffBottom = scene.add.sprite(-29, 98, Sprite.CliffBottom);

    const c1 = collision(scene, rect(-32, -48, 1, 32));
    const c2 = collision(scene, rect(-32, 0, 1, 32));
    const c3 = collision(scene, rect(-32, -16, 64, 1));
    const c4 = collision(scene, rect(-32, 0, 64, 1));
    const c5 = collision(scene, rect(32, -16, 1, 16));

    this.collisions = [c1, c2, c3, c4, c5];

    this.tiledSprite = tiledSprite;

    this.waves = scene.add.sprite(0, 0, Sprite.Waves).setAlpha(0);

    this.waves.anims.play(Animation.Waves);

    this.add([
      this.sprite,
      cliffTop,
      cliffBottom,
      c1.toGameObject(),
      c2.toGameObject(),
      c3.toGameObject(),
      c4.toGameObject(),
      c5.toGameObject(),
      this.waves,
      this.wavesAudio.toGameObject(),
    ]).setDepth(Depth.Main - 1);

    this.addToUpdateList();
  }

  public preUpdate() {
    this.tiledSprite.setFrame(this.waves.frame.name);
  }

  public setPosition(x?: number, y?: number, z?: number, w?: number): this {
    if (this.tiledSprite) {
      this.tiledSprite.setPosition((x ?? 0) + 120, y);
    }

    super.setPosition(x, y, z, w);

    return this;
  }

  public collisionOff(): this {
    this.collisions.forEach((o) => o.notSolid());

    return this;
  }

  public collisionOn(): this {
    this.collisions.forEach((o) => o.solid());

    return this;
  }
}
