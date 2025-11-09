import {
  iceCubeAboutPlant,
  iceCubeAboutSnowmanAndPlant,
  snowmanAfterLifingBarrier1,
  snowmanAfterLifingBarrier2,
} from 'common/conversations/autumn';
import { Player } from 'common/objects/player';
import { Snowman } from 'common/objects/snowman';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { Repeater } from 'common/utils/repeater';
import { Depth, Flag, Shader, Sprite } from 'constants';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';
import { rect, vec2 } from './phaser';
import { callbackOnEnterOnce, createDialogBoxStates } from './state_machine';

export const createIceCube = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Cube');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-4, -4, 8, 8));

  const trigger = collision(scene, map.getArea('Ice Cube Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([iceCubeAboutSnowmanAndPlant, iceCubeAboutPlant], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createSnowBarrierLiftCutscene = (
  scene: Phaser.Scene,
  player: Player,
  map: Tilemap,
  ySort: YSortObjects,
  cam: Camera
) => {
  const snowman = new Snowman(scene).setPosition(map.getPoint('Snowman Start').x, map.getPoint('Snowman Start').y);

  const trigger = collision(scene, map.getArea('Cutscene Trigger')).notSolid();

  const snowBarrier = scene.add
    .sprite(map.getPoint('Snow Barrier').x, map.getPoint('Snow Barrier').y, Sprite.Unknown)
    .setDepth(Depth.Main);

  const cutscene = sequence(scene)
    .of([
      runCallback(() => {
        setFlag(Flag.AutumnSnowBarrierLiftCutsceneWatched);
        player.disableUserInput();
        ui(scene).showLetterbox();
        cam.zoom(2, 1000).move(map.getPoint('Snowman Start'), 1000);
      }),
      wait(1000),
      runCallback(() => cam.follow(snowman)),
      new MoveToTarget(snowman.movement.setSpeed(16), map.getPoint('Snowman At Barrier')),
      // TODO: snowman animation
      // TODO: barrier removal animation
      wait(1000),
      runCallback(() => {
        cam.move(map.getPoint('Snowman At Barrier'), 1000);
        snowBarrier.destroy();
      }),
      wait(1000),
      new MoveToTarget(snowman.movement.setSpeed(32), map.getPoint('Snowman After Cutscene')),
      wait(1000),
      runCallback(() => {
        ui(scene).showLetterbox();
        cam.zoom(1, 1000).move(vec2(player.x, player.y), 1000);
      }),
      wait(1000),
      runCallback(() => {
        snowman.destroy();
        createSnowmanAfterCutscene(scene, player, map, ySort);
        cam.follow(player);
        player.enableUserInput();
      }),
    ])
    .destroyWhenComplete();

  const state = callbackOnEnterOnce(scene, trigger, player, () => {
    cutscene.start();
  });

  ySort.add(snowman);
};

export const createSnowmanAfterCutscene = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Snowman After Cutscene');

  const trigger = collision(scene, map.getArea('Snowman Trigger')).notSolid();

  const container = scene.add.existing(new Snowman(scene).setPosition(position.x, position.y));

  const repeater = new Repeater([snowmanAfterLifingBarrier1, snowmanAfterLifingBarrier2], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};
