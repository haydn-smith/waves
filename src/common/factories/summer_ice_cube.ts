import {
  iceCubeAfterPuzzle1,
  iceCubeAfterPuzzle2,
  iceCubeNoFans,
  iceCubeOnOneFan,
  iceCubeOnThreeFans,
  iceCubeOnTwoFans,
  iceCubeWall1,
  iceCubeWall2,
  youHopeIceCubeIsOkay,
} from 'common/conversations/summer';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { Repeater } from 'common/utils/repeater';
import { Depth, Flag, Shader, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { setFlag } from 'systems/flags';
import { runCallback, runTween, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';
import { rect } from './phaser';
import { createCallbackOnActivateOnce, createDialogBoxStates } from './state_machine';

export const createIceCube = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Cube');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-4, -4, 8, 8));

  const trigger = collision(scene, map.getArea('Ice Cube Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([iceCubeNoFans], 'repeat');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.next().currentItem());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createIceCubeAfterPuzzle = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Cube After Puzzle');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-4, -4, 8, 8));

  const trigger = collision(scene, map.getArea('Ice Cube After Puzzle Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([iceCubeAfterPuzzle1, iceCubeAfterPuzzle2], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => {
    const item = repeater.currentItem();
    repeater.next();
    return item;
  });

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createFan1 = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects, cam: Camera) => {
  const position = map.getPoint('Fan 1');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-2, -2, 4, 4));

  const trigger = collision(scene, map.getArea('Fan 1 Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const userInterface = ui(scene);

  const cutscene = sequence(scene).of([
    runCallback(() => {
      setFlag(Flag.SummerIceCubeFan1Activated);
      player.disableUserInput();
      userInterface.showLetterbox();
      cam.zoom(2, 1000);
      cam.pauseFollow();
      cam.move(map.getPoint('Fan 1'), 2000);
    }),
    wait(2000),
    // TODO: Play "fan on" animation.
    runCallback(() => {
      cam.move(map.getPoint('Ice Cube'), 2000);
    }),
    wait(2000),
    new PlayDialog(DialogBox.get(scene), iceCubeOnOneFan),
    runCallback(() => {
      userInterface.showLetterbox();
      cam.zoom(1, 1000);
      cam.resumeFollow();
    }),
    wait(1000),
    runCallback(() => {
      player.enableUserInput();
    }),
  ]);

  createCallbackOnActivateOnce(scene, player, trigger, position, () => cutscene.start());

  ySort.add(container);
};

export const createFan2 = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects, cam: Camera) => {
  const position = map.getPoint('Fan 2');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-2, -2, 4, 4));

  const trigger = collision(scene, map.getArea('Fan 2 Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const userInterface = ui(scene);

  const cutscene = sequence(scene).of([
    runCallback(() => {
      setFlag(Flag.SummerIceCubeFan2Activated);
      player.disableUserInput();
      userInterface.showLetterbox();
      cam.zoom(2, 1000);
      cam.pauseFollow();
      cam.move(map.getPoint('Fan 2'), 2000);
    }),
    wait(2000),
    // TODO: Play "fan on" animation.
    runCallback(() => {
      cam.move(map.getPoint('Ice Cube'), 2000);
    }),
    wait(2000),
    new PlayDialog(DialogBox.get(scene), iceCubeOnTwoFans),
    runCallback(() => {
      userInterface.showLetterbox();
      cam.zoom(1, 1000);
      cam.resumeFollow();
    }),
    wait(1000),
    runCallback(() => {
      player.enableUserInput();
    }),
  ]);

  createCallbackOnActivateOnce(scene, player, trigger, position, () => cutscene.start());

  ySort.add(container);
};

export const createFan3 = (
  scene: Phaser.Scene,
  player: Player,
  map: Tilemap,
  ySort: YSortObjects,
  cam: Camera,
  iceCube: Phaser.GameObjects.Container,
  iceWall: Phaser.GameObjects.Container
) => {
  const position = map.getPoint('Fan 3');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, rect(-2, -2, 4, 4));

  const trigger = collision(scene, map.getArea('Fan 3 Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const userInterface = ui(scene);

  const particles = scene.add
    .particles(iceCube.x - 64 - 32, iceCube.y, Sprite.White1px, {
      lifespan: 800,
      speed: { min: 160, max: 320 },
      angle: { min: 180 + 45 + 45 + 45, max: 360 - 45 + 45 },
      alpha: { end: 1, start: 1 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-16, -16, 32, 32) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
      },
      gravityY: 300,
      frequency: -1,
      quantity: 200,
    })
    .setDepth(Depth.Main + 1);

  particles.start();

  const cutscene = sequence(scene).of([
    runCallback(() => {
      setFlag(Flag.SummerIceCubeFan3Activated);
      player.disableUserInput();
      userInterface.showLetterbox();
      cam.zoom(2, 1000);
      cam.pauseFollow();
      cam.move(map.getPoint('Fan 3'), 2000);
    }),
    wait(2000),
    // TODO: Play "fan on" animation.
    runCallback(() => {
      cam.move(map.getPoint('Ice Cube'), 2000);
    }),
    wait(2000),
    new PlayDialog(DialogBox.get(scene), iceCubeOnThreeFans),
    wait(500),
    runTween(scene, {
      targets: iceCube,
      x: map.getPoint('Ice Cube Blown To').x,
      y: map.getPoint('Ice Cube Blown To').y,
      duration: 1000,
      ease: Phaser.Math.Easing.Quintic.In,
    }),
    runCallback(() => {
      particles.explode();
    }),
    wait(4000),
    new PlayDialog(DialogBox.get(scene), youHopeIceCubeIsOkay),
    wait(500),
    runCallback(() => {
      iceCube.destroy();
      iceWall.destroy();
      createIceWallAfterPuzzle(scene, player, map, ySort);
      createIceCubeAfterPuzzle(scene, player, map, ySort);
      userInterface.showLetterbox();
      cam.zoom(1, 1000);
      cam.resumeFollow();
    }),
    wait(1000),
    runCallback(() => {
      player.enableUserInput();
    }),
  ]);

  createCallbackOnActivateOnce(scene, player, trigger, position, () => cutscene.start());

  ySort.add(container);
};

export const createIceWall = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Wall');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const coll = collision(scene, map.getArea('Ice Wall Collision'));

  const trigger = collision(scene, map.getArea('Ice Wall Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const repeater = new Repeater([iceCubeWall1, iceCubeWall2], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
  });

  ySort.add(container);

  return container;
};

export const createIceWallAfterPuzzle = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Wall');

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setPipeline(Shader.Outline);

  const container = scene.add.container(position.x, position.y, [sprite]);

  ySort.add(container);

  return container;
};
