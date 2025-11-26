import { Player } from 'common/objects/player';
import { Storm } from 'common/objects/storm';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { fadeAudioVolume, getWindAudio } from 'common/utils/getWindAudio';
import { Action, Animation, Depth, Flag, Scene, Sprite } from 'constants';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';
import { vec2 } from './phaser';
import { callbackOnEnterOnce, createCallbackOnEnterAndExit } from './state_machine';

export const createFlower = (
  scene: Phaser.Scene,
  map: Tilemap,
  player: Player,
  ySortObjects: YSortObjects,
  camera: Camera
) => {
  const position = map.getPoint('Flower');

  const sprite = scene.add.sprite(position.x, position.y, Sprite.MainPlant);

  sprite.anims.play(Animation.MainPlantWindy);

  ySortObjects.add(sprite);

  const trigger = collision(scene, map.getArea('Trigger Flower Cutscene')).notSolid();

  const cutscene = sequence(scene)
    .of([
      runCallback(() => setFlag(Flag.WinterWaterFlowerCutsceneWatched)),
      runCallback(() => {
        player.disableUserInput();
        player.movement.faceDirection(Phaser.Math.Vector2.LEFT);
      }),
      runCallback(() => ui(scene).showLetterbox()),
      runCallback(() => player.movement.setSpeed(8)),
      wait(1000),
      runCallback(() => camera.pauseFollow().move(position, 2000)),
      wait(2200),
      new MoveToTarget(player.movement, map.getPoint('Next To Flower')),
      wait(200),
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.LEFT)),
      wait(1000),
      runCallback(() => {
        player.animator.states.change('custom');
        player.sprite.anims.stop();
        player.sprite.setTexture(Sprite.PlayerUmbrella);
        player.sprite.flipX = true;
        scene.add.image(player.x - 10, player.y - 8, Sprite.Umbrella).setDepth(Depth.Main + 1);
        sprite.anims.play(Animation.MainPlant);
      }),
      wait(3000),
      runCallback(() => {
        ui(scene).fadeOut(3000);

        const wind = getWindAudio(scene);
        fadeAudioVolume(scene, wind, 0);
      }),
      wait(6000),
      runCallback(() => scene.scene.start(Scene.SpringAgainTitle)),
    ])
    .destroyWhenComplete();

  callbackOnEnterOnce(scene, trigger, player, () => {
    cutscene.start();
  });
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
      } else if (!player.isUserInputDisabled) {
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
