import { rect } from 'common/factories/phaser';
import { CollisionMask, Shader, Sprite } from 'constants';
import { collision, Collision } from 'systems/collision';
import { movement, Movement } from 'systems/movement';

export class Snowman extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;

  public coll: Collision;

  public movement: Movement;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

    this.coll = collision(scene, rect(-4, -4, 8, 8)).mask(CollisionMask.Default);

    this.movement = movement(scene, this, this.coll).setSpeed(64);

    this.coll.toGameObject().movement = this.movement;

    this.add(this.sprite).add(this.coll.toGameObject());
  }
}
