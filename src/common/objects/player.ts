import { directionalInputs } from 'common/factories/input';
import { rect } from 'common/factories/phaser';
import { scaled } from 'common/utils/scaled';
import { Action, CollisionTag, Sprite } from 'constants';
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

    this.collision = collision(this.scene, rect(scaled(-4), scaled(-4), scaled(8), scaled(2))).tag(CollisionTag.Player);

    this.movement = movement(this.scene, this, this.collision)
      .setSpeed(scaled(32))
      .setAcceleration(scaled(128))
      .moveWithVelocity()
      .setMovementEase(Phaser.Math.Easing.Sine.In);

    this.inputs = directionalInputs(this.scene);

    this.add(this.collision.toGameObject());

    this.sprite = this.scene.add.sprite(0, scaled(-8), Sprite.PlayerIdle);

    this.add(this.sprite);
  }

  public preUpdate(_time: number, delta: number) {
    const x = this.isUserInputDisabled ? 0 : this.inputs.isActive(Action.Right) - this.inputs.isActive(Action.Left);

    const y = this.isUserInputDisabled ? 0 : this.inputs.isActive(Action.Down) - this.inputs.isActive(Action.Up);

    this.movement.moveInDirection(new Phaser.Math.Vector2(x, y), delta);
  }

  public sleep(): Player {
    this.sprite.setTexture(Sprite.PlayerSleep);

    return this;
  }

  public wave(): Player {
    this.sprite.setTexture(Sprite.PlayerWave);

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
}
