import { TypeOfAnimation } from 'constants';
import { Movement } from 'systems/movement';
import { playAnimation, runCallback, sequence } from 'systems/sequence';
import { states, States } from 'systems/states';

export class Animator extends Phaser.GameObjects.GameObject {
  private movementAnimations: Partial<Record<'north' | 'south' | 'east', TypeOfAnimation>> = {};

  private idleAnimations: Partial<Record<'north' | 'south' | 'east', TypeOfAnimation>> = {};

  public states: States<'movement' | 'custom', 'movement'>;

  constructor(
    scene: Phaser.Scene,
    public sprite: Phaser.GameObjects.Sprite,
    public movement?: Movement
  ) {
    super(scene, 'Animator');

    this.states = states<'movement' | 'custom', 'custom'>(scene, 'custom').add('movement', () => {
      if (this.movement === undefined) {
        return;
      }

      if (this.movement.isMoving()) {
        if (this.movement.cardinal() === 'north') {
          this.sprite.anims.play(this.movementAnimations['north'] ?? '', true);
          this.sprite.flipX = false;
        }

        if (this.movement.cardinal() === 'south') {
          this.sprite.anims.play(this.movementAnimations['south'] ?? '', true);
          this.sprite.flipX = false;
        }

        if (this.movement.cardinal() === 'east') {
          this.sprite.anims.play(this.movementAnimations['east'] ?? '', true);
          this.sprite.flipX = false;
        }

        if (this.movement.cardinal() === 'west') {
          this.sprite.anims.play(this.movementAnimations['east'] ?? '', true);
          this.sprite.flipX = true;
        }
      }

      if (this.movement.isNotMoving()) {
        if (this.movement.cardinal() === 'north') {
          this.sprite.anims.play(this.idleAnimations['north'] ?? '', true);
          this.sprite.flipX = false;
        }

        if (this.movement.cardinal() === 'south') {
          this.sprite.anims.play(this.idleAnimations['south'] ?? '', true);
          this.sprite.flipX = false;
        }

        if (this.movement.cardinal() === 'east') {
          this.sprite.anims.play(this.idleAnimations['east'] ?? '', true);
          this.sprite.flipX = false;
        }

        if (this.movement.cardinal() === 'west') {
          this.sprite.anims.play(this.idleAnimations['east'] ?? '', true);
          this.sprite.flipX = true;
        }
      }
    });

    this.renderFlags = 0;
  }

  public setMovementAnimations(north: TypeOfAnimation, south: TypeOfAnimation, east: TypeOfAnimation): this {
    this.movementAnimations['north'] = north;
    this.movementAnimations['south'] = south;
    this.movementAnimations['east'] = east;

    return this;
  }

  public setIdleAnimations(north: TypeOfAnimation, south: TypeOfAnimation, east: TypeOfAnimation): this {
    this.idleAnimations['north'] = north;
    this.idleAnimations['south'] = south;
    this.idleAnimations['east'] = east;

    return this;
  }

  public playMovementAndIdleAnimations(): this {
    this.states.change('movement');

    return this;
  }

  public stopMovementAnimations(): this {
    this.states.change('custom');

    return this;
  }

  public playAnimation(animation: TypeOfAnimation, flip?: boolean): this {
    this.sprite.anims.play(animation, true);

    this.sprite.flipX = !!flip;

    this.states.change('custom');

    return this;
  }

  public playAnimationOnce(animation: TypeOfAnimation, flip?: boolean): this {
    this.sprite.flipX = !!flip;

    sequence(this.scene)
      .of([
        runCallback(() => this.states.change('custom')),
        playAnimation(this.sprite, animation),
        runCallback(() => this.states.change('movement')),
      ])
      .start()
      .destroyWhenComplete();

    return this;
  }

  public destroy() {
    super.destroy();
    this.states.destroy();
  }
}
