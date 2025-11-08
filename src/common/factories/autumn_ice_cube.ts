import { iceCubeSnowBarrier, iceCubeThanks, snowBarrier } from 'common/conversations/autumn';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { Repeater } from 'common/utils/repeater';
import { Depth, Shader, Sprite } from 'constants';
import { collision } from 'systems/collision';
import { rect } from './phaser';
import { createDialogBoxStates } from './state_machine';

export const createIceCube = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Cube');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-4, -4, 8, 8));

  const trigger = collision(scene, map.getArea('Ice Cube Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([iceCubeThanks, iceCubeSnowBarrier], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createSnowBarrier = (scene: Phaser.Scene, player: Player, map: Tilemap) => {
  const position = map.getPoint('Snow Barrier');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, map.getArea('Snow Barrier Body'));

  const trigger = collision(scene, map.getArea('Snow Barrier Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite]).setDepth(Depth.Main + 1);

  const repeater = new Repeater([snowBarrier], 'repeat');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
    coll.destroy();
  });

  return container;
};
