import {
  checkOnPlant,
  iceCubeWinter1,
  iceCubeWinter2,
  iceCubeWinter3,
  snowmanWinter1,
  snowmanWinter2,
} from 'common/conversations/winter';
import { Player } from 'common/objects/player';
import { Storm } from 'common/objects/storm';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { fadeAudioVolume, getAudioSingleton, getWindAudio } from 'common/utils/getWindAudio';
import { Repeater } from 'common/utils/repeater';
import { Action, Animation, Sound, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { runCallback, sequence, wait } from 'systems/sequence';
import { rect, vec2 } from './phaser';
import { createCallbackOnEnterAndExit, createDialogBoxStates } from './state_machine';

export const createSnowman = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Snowman');

  const sprite = scene.add.sprite(0, -5, Sprite.Unknown);

  sprite.anims.play(Animation.SnowmamNoSnowballs);

  const coll = collision(scene, rect(-16, -4, 32, 8));

  const trigger = collision(scene, map.getArea('Snowman Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([snowmanWinter1, snowmanWinter2], 'repeat last');

  const states = createDialogBoxStates(
    scene,
    player,
    trigger,
    position,
    () => repeater.currentItemThenNext(),
    undefined,
    -4
  );

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createIceCube = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Cube');

  const sprite = scene.add.sprite(0, -5, Sprite.IceCubeFrozen);

  const coll = collision(scene, rect(-16, -3, 32, 8));

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

export const createStorm = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera, storm: Storm) => {
  const area = collision(scene, map.getArea('Storm Area')).notSolid();

  createCallbackOnEnterAndExit(
    scene,
    area,
    player.collision,
    () => {
      storm.extremeIntensity();
      player.movement.setSpeed(16);
      camera.shake(8, 0, -1, 100);
      camera.zoom(2, 1000);

      const music = getAudioSingleton(scene, Sound.MusicWinter);
      fadeAudioVolume(scene, music, 0.2, 100);

      const wind = getWindAudio(scene);
      fadeAudioVolume(scene, wind, 0.8, 300);
    },
    () => {
      player.animator.setMovementAnimations(Animation.PlayerRunUp, Animation.PlayerRunDown, Animation.PlayerRunRight);
      storm.highIntensity();
      player.movement.setSpeed(40);
      player.movement.setAcceleration(128);
      camera.shake(2, 0, -1, 200);
      camera.zoom(1, 1000);

      const music = getAudioSingleton(scene, Sound.MusicWinter);
      fadeAudioVolume(scene, music, 0.4, 100);

      const wind = getWindAudio(scene);
      fadeAudioVolume(scene, wind, 0.4, 300);
    },
    (delta: number) => {
      if (
        player.inputs.isActive(Action.Left) ||
        player.inputs.isActive(Action.Up) ||
        player.inputs.isActive(Action.Down)
      ) {
        player.animator.setMovementAnimations(
          Animation.PlayerRunUp,
          Animation.PlayerRunDown,
          Animation.PlayerStruggleRight
        );
        player.movement.setSpeed(16);
        player.movement.setAcceleration(128);
      } else {
        player.animator.setMovementAnimations(Animation.PlayerRunUp, Animation.PlayerRunDown, Animation.PlayerRunRight);
        player.movement.setSpeed(128);
        player.movement.setAcceleration(256);
        player.movement.setVelocity(
          vec2(player.movement.velocity().x + 128 * delta * 0.001, player.movement.velocity().y)
        );
      }
    }
  );
};

export const createJettyAreaBlocked = (scene: Phaser.Scene, player: Player, map: Tilemap) => {
  const area = collision(scene, map.getArea('Jetty Area Blocked')).notSolid();

  createCallbackOnEnterAndExit(scene, area, player.collision, () => {
    sequence(scene)
      .of([
        runCallback(() => {
          player.disableUserInput();
        }),
        wait(500),
        new PlayDialog(DialogBox.get(scene), checkOnPlant),
        wait(500),
        new MoveToTarget(player.movement, map.getPoint('Player Start')),
        runCallback(() => {
          player.enableUserInput();
        }),
      ])
      .start()
      .destroyWhenComplete();
  });
};
