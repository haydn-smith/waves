import { snowmanNoSnow } from 'common/conversations/autumn';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { Repeater } from 'common/utils/repeater';
import { CollisionMask, CollisionTag, Shader, Sprite } from 'constants';
import { collision } from 'systems/collision';
import { movement } from 'systems/movement';
import { rect } from './phaser';
import { createDialogBoxStates } from './state_machine';

export const createSnowman = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Snowman');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-4, -4, 8, 8));

  const trigger = collision(scene, map.getArea('Snowman Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([snowmanNoSnow], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createSnow1 = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Snowman Piece One');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-4, -4, 8, 8))
    .tag(CollisionTag.Pushable)
    .mask(CollisionMask.Default | CollisionMask.Pushable);

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const move = movement(scene, container, coll).moveWithoutVelocity().setSpeed(32);

  coll.toGameObject().movement = move;

  ySort.add(container);

  return container;
};
