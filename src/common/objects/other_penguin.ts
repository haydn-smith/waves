import { rect } from 'common/factories/phaser';
import { scaled } from 'common/utils/scaled';
import { Animation, CollisionTag, Sprite } from 'constants';
import { collision, Collision } from 'systems/collision';
import { movement, Movement } from 'systems/movement';
import { Animator } from './animator';

export class OtherPenguin extends Phaser.GameObjects.Container {
  private collision: Collision;

  public movement: Movement;

  private sprite: Phaser.GameObjects.Sprite;

  public animator: Animator;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.collision = collision(this.scene, rect(scaled(-4), scaled(-4), scaled(8), scaled(2)))
      .tag(CollisionTag.Player)
      .tag(CollisionTag.ThrowsSnow);

    this.movement = movement(this.scene, this, this.collision)
      .setSpeed(scaled(40))
      .setAcceleration(scaled(128))
      .moveWithVelocity()
      .setMovementEase(Phaser.Math.Easing.Sine.In);

    this.add(this.collision.toGameObject());

    this.sprite = this.scene.add.sprite(0, scaled(-8), Sprite.PlayerIdle);

    this.add(this.sprite);

    this.addToUpdateList();

    this.animator = new Animator(scene, this.sprite, this.movement);

    this.animator.setMovementAnimations(Animation.PlayerRunUp, Animation.PlayerRunDown, Animation.PlayerRunRight);

    this.animator.setIdleAnimations(Animation.PlayerIdleUp, Animation.PlayerIdleDown, Animation.PlayerIdleRight);

    this.animator.playMovementAndIdleAnimations();
  }

  public destroy() {
    this.animator.destroy();
    this.movement.destroy();
    super.destroy();
  }
}
