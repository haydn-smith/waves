import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { Flag, Scene, Sprite } from 'constants';
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

  ySortObjects.add(sprite);

  const trigger = collision(scene, map.getArea('Trigger Flower Cutscene')).notSolid();

  const cutscene = sequence(scene)
    .of([
      runCallback(() => setFlag(Flag.WinterWaterFlowerCutsceneWatched)),
      runCallback(() => player.disableUserInput()),
      runCallback(() => ui(scene).showLetterbox()),
      runCallback(() => camera.zoom(2, 1000)),
      runCallback(() => player.movement.setSpeed(16)),
      wait(1000),
      runCallback(() => camera.pauseFollow().move(position, 2000)),
      wait(2200),
      new MoveToTarget(player.movement, map.getPoint('Next To Flower')),
      wait(1000),
      runCallback(() => player.water()),
      wait(3000),
      runCallback(() => ui(scene).fadeOut(3000)),
      wait(3000),
      runCallback(() => scene.scene.start(Scene.SpringAgainTitle)),
    ])
    .destroyWhenComplete();

  callbackOnEnterOnce(scene, trigger, player, () => {
    cutscene.start();
  });
};

export const createStorm1 = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera) => {
  const area = collision(scene, map.getArea('Storm Area 1')).notSolid();

  createCallbackOnEnterAndExit(
    scene,
    area,
    player.collision,
    () => {},
    () => {
      player.movement.setSpeed(32);
      camera.shake(2, 0, -1, 200);
    },
    (delta: number) => {
      player.movement.setSpeed(16);
      camera.shake(8, 0, -1, 100);
      if (player.movement.velocity().x >= 0) {
        player.movement.setVelocity(
          vec2(player.movement.velocity().x + 16 * delta * 0.001, player.movement.velocity().y)
        );
      }
    }
  );
};

export const createStorm2 = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera) => {
  const area = collision(scene, map.getArea('Storm Area 2')).notSolid();

  createCallbackOnEnterAndExit(
    scene,
    area,
    player.collision,
    () => {},
    () => {
      player.movement.setSpeed(32);
      camera.shake(2, 0, -1, 200);
    },
    (delta: number) => {
      player.movement.setSpeed(16);
      camera.shake(10, 0, -1, 100);
      if (player.movement.velocity().x >= 0) {
        player.movement.setVelocity(
          vec2(player.movement.velocity().x + 16 * delta * 0.001, player.movement.velocity().y)
        );
      }
    }
  );
};

export const createStorm3 = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera) => {
  const area = collision(scene, map.getArea('Storm Area 3')).notSolid();

  const area2 = collision(scene, map.getArea('Trigger Flower Cutscene')).notSolid();

  const states = createCallbackOnEnterAndExit(
    scene,
    area,
    player.collision,
    () => {},
    () => {
      player.movement.setSpeed(32);
      camera.shake(2, 0, -1, 200);
    },
    (delta: number) => {
      player.movement.setSpeed(16);
      camera.shake(12, 0, -1, 100);
      if (player.movement.velocity().x >= 0) {
        player.movement.setVelocity(
          vec2(player.movement.velocity().x + 16 * delta * 0.001, player.movement.velocity().y)
        );
      }
    }
  );

  callbackOnEnterOnce(scene, area2, player, () => {
    player.movement.setSpeed(8);
    states.destroy();
  });
};
