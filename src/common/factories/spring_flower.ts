import {
  deadFlower1_1,
  deadFlower1_2,
  deadFlower2_1,
  deadFlower2_2,
  deadFlower3_1,
  deadFlower3_2,
  springFlower,
} from 'common/conversations/spring';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { Repeater } from 'common/utils/repeater';
import { Animation, Flag, Scene, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';
import { rect } from './phaser';
import { callbackOnEnterOnce, createDialogBoxStates } from './state_machine';

export const createFlower = (
  scene: Phaser.Scene,
  map: Tilemap,
  player: Player,
  ySortObjects: YSortObjects,
  camera: Camera
) => {
  const position = map.getPoint('Flower');

  const sprite = scene.add.sprite(position.x, position.y, Sprite.MainPlant);

  sprite.anims.play(Animation.MainPlant);

  ySortObjects.add(sprite);

  const trigger = collision(scene, map.getArea('Trigger Flower Cutscene')).notSolid();

  const cutscene = sequence(scene)
    .of([
      runCallback(() => setFlag(Flag.SpringWaterFlowerCutsceneWatched)),
      runCallback(() => {
        player.disableUserInput();
        player.movement.faceDirection(Phaser.Math.Vector2.LEFT);
      }),
      runCallback(() => ui(scene).showLetterbox()),
      runCallback(() => camera.zoom(2, 1000)),
      runCallback(() => player.movement.setSpeed(16)),
      wait(1000),
      runCallback(() => camera.pauseFollow().move(position, 2000)),
      wait(2200),
      new MoveToTarget(player.movement, map.getPoint('Next To Flower')),
      wait(200),
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.LEFT)),
      wait(1000),
      new PlayDialog(DialogBox.get(scene), springFlower),
      wait(1000),
      runCallback(() => player.animator.playAnimation(Animation.PlayerWater)),
      wait(3000),
      runCallback(() => player.animator.playMovementAndIdleAnimations()),
      wait(1000),
      runCallback(() => {
        player.animator.playAnimation(Animation.PlayerRunRight, true);
      }),
      new MoveToTarget(player.movement, map.getPoint('Back From Flower')),
      runCallback(() => {
        player.animator.playAnimation(Animation.PlayerIdleRight, true);
      }),
      wait(600),
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.DOWN)),
      wait(600),
      runCallback(() => player.sprite.anims.playReverse(Animation.PlayerWakeUp)),
      wait(2000),
      runCallback(() => {
        player.sprite.anims.play(Animation.PlayerSleep);
        player.sprite.flipX = false;
      }),
      wait(3000),
      runCallback(() => ui(scene).fadeOut(3000)),
      wait(3000),
      runCallback(() => scene.scene.start(Scene.SummerTitle)),
    ])
    .destroyWhenComplete();

  callbackOnEnterOnce(scene, trigger, player, () => {
    cutscene.start();
  });
};

export const createDeadFlower1 = (scene: Phaser.Scene, map: Tilemap, player: Player, ySortObjects: YSortObjects) => {
  const position = map.getPoint('Dead Flower 1');

  const sprite = scene.add.sprite(0, 0, Sprite.DeadPlant1);

  const trigger = collision(scene, rect(position.x - 16, position.y - 16, 32, 32)).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite]);

  const repeater = new Repeater([deadFlower1_1, deadFlower1_2], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySortObjects.add(container);

  return container;
};

export const createDeadFlower2 = (scene: Phaser.Scene, map: Tilemap, player: Player, ySortObjects: YSortObjects) => {
  const position = map.getPoint('Dead Flower 2');

  const sprite = scene.add.sprite(0, 0, Sprite.DeadPlant2);

  const trigger = collision(scene, rect(position.x - 16, position.y - 16, 32, 32)).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite]);

  const repeater = new Repeater([deadFlower2_1, deadFlower2_2], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySortObjects.add(container);

  return container;
};

export const createDeadFlower3 = (scene: Phaser.Scene, map: Tilemap, player: Player, ySortObjects: YSortObjects) => {
  const position = map.getPoint('Dead Flower 3');

  const sprite = scene.add.sprite(0, 0, Sprite.DeadPlant3);

  const trigger = collision(scene, rect(position.x - 16, position.y - 16, 32, 32)).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite]);

  const repeater = new Repeater([deadFlower3_1, deadFlower3_2], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySortObjects.add(container);

  return container;
};
