import {
  iceCubeWinter1,
  iceCubeWinter2,
  iceCubeWinter3,
  snowmanWinter1,
  snowmanWinter2,
} from 'common/conversations/winter';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { Repeater } from 'common/utils/repeater';
import { Shader, Sprite } from 'constants';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { rect, vec2 } from './phaser';
import { createCallbackOnEnterAndExit, createDialogBoxStates } from './state_machine';

export const createSnowman = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Snowman');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-4, -4, 8, 8));

  const trigger = collision(scene, map.getArea('Snowman Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([snowmanWinter1, snowmanWinter2], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createIceCube = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Cube');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-4, -4, 8, 8));

  const trigger = collision(scene, map.getArea('Ice Cube Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([iceCubeWinter1, iceCubeWinter2, iceCubeWinter3], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createStorm = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera) => {
  const area = collision(scene, map.getArea('Storm Area')).notSolid();

  createCallbackOnEnterAndExit(
    scene,
    area,
    player.collision,
    () => {
      player.movement.setSpeed(16);
      camera.shake(8, 0, -1, 100);
    },
    () => {
      player.movement.setSpeed(32);
      camera.shake(2, 0, -1, 200);
    },
    (delta: number) => {
      player.movement.setVelocity(
        vec2(player.movement.velocity().x + 16 * delta * 0.001, player.movement.velocity().y)
      );
    }
  );
};
