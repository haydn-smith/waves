import { fallLeaves1, fallLeaves2 } from 'common/conversations/autumn';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { Repeater } from 'common/utils/repeater';
import { Depth, Shader, Sprite } from 'constants';
import { collision } from 'systems/collision';
import { createDialogBoxStates } from './state_machine';

export const createFallLeaves1 = (scene: Phaser.Scene, player: Player, map: Tilemap) => {
  const position = map.getPoint('Fall Leaves 1');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const trigger = collision(scene, map.getArea('Fall Leaves 1 Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite]).setDepth(Depth.Main - 1);

  const repeater = new Repeater([fallLeaves1], 'repeat');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  return container;
};

export const createFallLeaves2 = (scene: Phaser.Scene, player: Player, map: Tilemap) => {
  const position = map.getPoint('Fall Leaves 2');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const trigger = collision(scene, map.getArea('Fall Leaves 2 Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite]).setDepth(Depth.Main - 1);

  const repeater = new Repeater([fallLeaves2], 'repeat');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  return container;
};
