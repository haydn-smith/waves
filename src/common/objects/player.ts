import { directionalInputs } from 'common/factories/input';
import { rect, vec2 } from 'common/factories/phaser';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, CollisionMask, CollisionTag, Sprite } from 'constants';
import { collision, Collision } from 'systems/collision';
import { Input } from 'systems/input';
import { movement, Movement } from 'systems/movement';

export class Player extends Phaser.GameObjects.Container {
  public collision: Collision;

  public movement: Movement;

  private inputs: Input;

  private sprite: Phaser.GameObjects.Sprite;

  private isUserInputDisabled = false;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.collision = collision(this.scene, rect(scaled(-4), scaled(-4), scaled(8), scaled(2)))
      .tag(CollisionTag.Player)
      .tag(CollisionTag.ThrowsSnow)
      .mask(CollisionMask.Default);

    this.movement = movement(this.scene, this, this.collision)
      .setSpeed(scaled(32))
      .setAcceleration(scaled(128))
      .moveWithVelocity()
      .setMovementEase(Phaser.Math.Easing.Sine.In)
      .onCollide((collision, velocity, isX, delta) => {
        if (collision.hasTag(CollisionTag.Pushable)) {
          this.pushInDirection(collision, velocity, isX, delta);
        }
      });

    this.inputs = directionalInputs(this.scene);

    this.add(this.collision.toGameObject());

    this.sprite = this.scene.add.sprite(0, scaled(-8), Sprite.PlayerIdle);

    this.sprite.pipeline.set2f('uResolution', 32, 32);

    this.add(this.sprite);
  }

  public preUpdate(_time: number, delta: number) {
    const x = this.isUserInputDisabled ? 0 : this.inputs.isActive(Action.Right) - this.inputs.isActive(Action.Left);

    const y = this.isUserInputDisabled ? 0 : this.inputs.isActive(Action.Down) - this.inputs.isActive(Action.Up);

    this.movement.moveInDirection(new Phaser.Math.Vector2(x, y), delta);

    if (this.movement.isMoving()) {
      if (this.movement.cardinal() === 'north') {
        this.sprite.anims.play(Animation.PlayerRunUp, true);
      }

      if (this.movement.cardinal() === 'south') {
        this.sprite.anims.play(Animation.PlayerRunDown, true);
      }

      if (this.movement.cardinal() === 'east') {
        this.sprite.anims.play(Animation.PlayerRunRight, true);
        this.sprite.flipX = false;
      }

      if (this.movement.cardinal() === 'west') {
        this.sprite.anims.play(Animation.PlayerRunRight, true);
        this.sprite.flipX = true;
      }
    }

    if (this.movement.isNotMoving()) {
      if (this.movement.cardinal() === 'north') {
        this.sprite.anims.play(Animation.PlayerIdleUp, true);
      }

      if (this.movement.cardinal() === 'south') {
        this.sprite.anims.play(Animation.PlayerIdleDown, true);
      }

      if (this.movement.cardinal() === 'east') {
        this.sprite.anims.play(Animation.PlayerIdleRight, true);
        this.sprite.flipX = false;
      }

      if (this.movement.cardinal() === 'west') {
        this.sprite.anims.play(Animation.PlayerIdleRight, true);
        this.sprite.flipX = true;
      }
    }
  }

  public sleep(): Player {
    this.sprite.setTexture(Sprite.PlayerSleep);

    return this;
  }

  public wave(): Player {
    this.sprite.setTexture(Sprite.PlayerWave);

    return this;
  }

  public water(): Player {
    this.sprite.setTexture(Sprite.PlayerWater);

    return this;
  }

  public runnningAround(): Player {
    this.sprite.setTexture(Sprite.PlayerIdle);

    return this;
  }

  public disableUserInput(): Player {
    this.isUserInputDisabled = true;

    return this;
  }

  public enableUserInput(): Player {
    this.isUserInputDisabled = false;

    return this;
  }

  private pushInDirection(collision: Collision, velocity: Phaser.Math.Vector2, isX: boolean, delta: number): void {
    const move = vec2(isX ? velocity.x : 0, !isX ? velocity.y : 0);

    collision.toGameObject().movement.moveInDirection(move.normalize(), delta);

    this.movement.setVelocity(velocity);
  }
}
