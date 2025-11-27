import { snowmanNoSnow, snowmanNoSnow2 } from 'common/conversations/autumn';
import { Player } from 'common/objects/player';
import { Snowman } from 'common/objects/snowman';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { Repeater } from 'common/utils/repeater';
import { CollisionMask, CollisionTag, Sprite } from 'constants';
import { collision } from 'systems/collision';
import { movement } from 'systems/movement';
import { states } from 'systems/states';
import { rect } from './phaser';
import { createDialogBoxStates } from './state_machine';

export const createSnowman = (
  scene: Phaser.Scene,
  player: Player,
  map: Tilemap,
  ySort: YSortObjects,
  isDialogActive: () => void
) => {
  const position = map.getPoint('Snowman');

  const trigger = collision(scene, map.getArea('Snowman Trigger')).notSolid();

  const container = scene.add.existing(new Snowman(scene).setPosition(position.x, position.y));

  const repeater = new Repeater([snowmanNoSnow, snowmanNoSnow2], 'repeat last');

  const states = createDialogBoxStates(
    scene,
    player,
    trigger,
    position,
    () => repeater.currentItemThenNext(),
    isDialogActive,
    -12
  );

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createSnow1 = (
  scene: Phaser.Scene,
  player: Player,
  map: Tilemap,
  ySort: YSortObjects,
  onActivate: () => void
) => {
  const position = map.getPoint('Snowman Piece 1');

  const sprite = scene.add.sprite(0, -8, Sprite.Snowball);

  const coll = collision(scene, rect(-6, -12, 12, 12))
    .tag(CollisionTag.Pushable)
    .mask(CollisionMask.Default | CollisionMask.Pushable);

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const move = movement(scene, container, coll).moveWithoutVelocity().setSpeed(80);

  const trigger = collision(scene, map.getArea('Snowman Piece Trigger')).notSolid().mask(CollisionMask.Pushable);

  const state = states(scene, 'idle').add('idle', () => {
    if (trigger.intersects(coll)) {
      onActivate();
      state.destroy();
    }
  });

  coll.toGameObject().movement = move;

  ySort.add(container);

  return container;
};

export const createSnow2 = (
  scene: Phaser.Scene,
  player: Player,
  map: Tilemap,
  ySort: YSortObjects,

  onActivate: () => void
) => {
  const position = map.getPoint('Snowman Piece 2');

  const sprite = scene.add.sprite(0, -8, Sprite.Snowball);

  const coll = collision(scene, rect(-6, -12, 12, 12))
    .tag(CollisionTag.Pushable)
    .mask(CollisionMask.Default | CollisionMask.Pushable);

  const trigger = collision(scene, map.getArea('Snowman Piece Trigger')).notSolid();

  const state = states(scene, 'idle').add('idle', () => {
    if (trigger.intersects(coll)) {
      onActivate();
      state.destroy();
    }
  });

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const move = movement(scene, container, coll).moveWithoutVelocity().setSpeed(80);

  coll.toGameObject().movement = move;

  ySort.add(container);

  return container;
};

export const createSnow3 = (
  scene: Phaser.Scene,
  player: Player,
  map: Tilemap,
  ySort: YSortObjects,
  onActivate: () => void
) => {
  const position = map.getPoint('Snowman Piece 3');

  const sprite = scene.add.sprite(0, -8, Sprite.Snowball);

  const coll = collision(scene, rect(-6, -12, 12, 12))
    .tag(CollisionTag.Pushable)
    .mask(CollisionMask.Default | CollisionMask.Pushable);

  const trigger = collision(scene, map.getArea('Snowman Piece Trigger')).notSolid();

  const state = states(scene, 'idle').add('idle', () => {
    if (trigger.intersects(coll)) {
      onActivate();
      state.destroy();
    }
  });
  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const move = movement(scene, container, coll).moveWithoutVelocity().setSpeed(80);

  coll.toGameObject().movement = move;

  ySort.add(container);

  return container;
};
