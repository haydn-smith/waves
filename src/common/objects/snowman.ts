import { rect } from 'common/factories/phaser';
import { Animation, CollisionMask, Sprite } from 'constants';
import { collision, Collision } from 'systems/collision';
import { movement, Movement } from 'systems/movement';

export class Snowman extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;

  public coll: Collision;

  public movement: Movement;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.sprite = scene.add.sprite(0, -14, Sprite.SnowmanIdleRight);

    this.sprite.anims.play(Animation.SnowmanIdleRight);

    this.coll = collision(scene, rect(-4, -6, 8, 4)).mask(CollisionMask.Default);

    this.movement = movement(scene, this, this.coll).setSpeed(64);

    this.coll.toGameObject().movement = this.movement;

    this.add(this.sprite).add(this.coll.toGameObject());
  }

  public animationForCount(count: number) {
    if (count === 0) {
      this.noBalls();

      return;
    }

    if (count === 1) {
      this.oneBall();

      return;
    }

    if (count === 2) {
      this.twoBalls();

      return;
    }

    this.allBalls();
  }

  public allBalls() {
    this.sprite.setPosition(0, -14);
    this.sprite.anims.play(Animation.SnowmanIdleRight);
    this.sprite.flipX = false;
  }

  public noBalls() {
    this.sprite.setPosition(0, -6);
    this.sprite.anims.play(Animation.SnowmamNoSnowballs);
  }

  public oneBall() {
    this.sprite.setPosition(0, -6);
    this.sprite.anims.play(Animation.SnowmamOneSnowball);
  }

  public twoBalls() {
    this.sprite.setPosition(0, -14);
    this.sprite.anims.play(Animation.SnowmanTwoSnowballs);
  }

  public magic() {
    this.sprite.anims.play(Animation.SnowmanMagic);
    this.sprite.flipX = true;
  }
}
