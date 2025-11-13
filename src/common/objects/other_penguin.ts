import { rect } from 'common/factories/phaser';
import { scaled } from 'common/utils/scaled';
import { CollisionTag, Sprite } from 'constants';
import { collision, Collision } from 'systems/collision';
import { movement, Movement } from 'systems/movement';

export class OtherPenguin extends Phaser.GameObjects.Container {
  private collision: Collision;

  public movement: Movement;

  private sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.collision = collision(this.scene, rect(scaled(-4), scaled(-4), scaled(8), scaled(2)))
      .tag(CollisionTag.Player)
      .tag(CollisionTag.ThrowsSnow);

    this.movement = movement(this.scene, this, this.collision)
      .setSpeed(scaled(32))
      .setAcceleration(scaled(128))
      .moveWithVelocity()
      .setMovementEase(Phaser.Math.Easing.Sine.In);

    this.add(this.collision.toGameObject());

    this.sprite = this.scene.add.sprite(0, scaled(-8), Sprite.PlayerIdle);

    this.add(this.sprite);
  }
}
