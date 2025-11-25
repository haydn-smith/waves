import {
  iceCubeAfterPuzzle1,
  iceCubeAfterPuzzle2,
  iceCubeNoFans,
  iceCubeOnOneFan,
  iceCubeOnThreeFans,
  iceCubeWall1,
  iceCubeWall2,
  snowCaveIn1,
  snowCaveIn2,
  youHopeIceCubeIsOkay,
} from 'common/conversations/summer';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { Repeater } from 'common/utils/repeater';
import { Action, Animation, Depth, Flag, Shader, Sound, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { spatialAudio } from 'systems/audio';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { checkFlag, setFlag } from 'systems/flags';
import { runCallback, runTween, sequence, Sequenceable, wait } from 'systems/sequence';
import { states } from 'systems/states';
import { ui, UserInterface } from 'systems/ui';
import { actionInput } from './input';
import { rect, vec2 } from './phaser';
import { createCallbackOnActivateOnce, createCallbackOnEnterAndExit, createDialogBoxStates } from './state_machine';

export const createIceCube = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Cube');

  const sprite = scene.add.sprite(0, 0, Sprite.IceCubeFrozen);
  const sprite2 = scene.add.sprite(position.x, position.y, Sprite.IceCubePuddle).setDepth(Depth.Main - 1);

  sprite.anims.play(Animation.IceCubeRight);

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

  const sprite = scene.add.sprite(0, 0, Sprite.IceCubeRight);

  sprite.anims.play(Animation.IceCubeRight);

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

export const createFan1 = (
  scene: Phaser.Scene,
  player: Player,
  map: Tilemap,
  ySort: YSortObjects,
  cam: Camera,
  iceCube: Phaser.GameObjects.Container,
  iceWall: Phaser.GameObjects.Container
) => {
  const position = map.getPoint('Fan 1');

  const sprite = scene.add.sprite(0, -16, Sprite.Fan1Off);

  const coll = collision(scene, rect(-10, -2, 18, 2));

  const trigger = collision(scene, map.getArea('Fan 1 Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const userInterface = ui(scene);

  const particles = scene.add
    .particles(position.x - 16, position.y - 16, Sprite.White1px, {
      lifespan: 800,
      speed: { min: 80, max: 100 },
      angle: { min: 180, max: 180 + 45 },
      alpha: { end: 1, start: 1 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-16, -16, 32, 32) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
      },
      gravityY: 0,
      frequency: 10,
      quantity: 1,
    })
    .setDepth(Depth.Main + 1)
    .stop();

  const sound = spatialAudio(scene, Sound.IceCrack).loop().setPosition(position).setDistance(64).setVolume(0.2);

  const cutscene = () =>
    sequence(scene).of([
      runCallback(() => {
        setFlag(Flag.SummerIceCubeFan1Activated);
        player.disableUserInput();
        userInterface.showLetterbox();
        cam.zoom(2, 1000);
        cam.pauseFollow();
        cam.move(map.getPoint('Fan 1'), 2000);
      }),
      wait(1000),
      runCallback(() => {
        sprite.anims.play(Animation.Fan1);
        sound.play();
        particles.start();
      }),
      wait(2000),
      runCallback(() => {
        cam.move(vec2(map.getPoint('Ice Cube').x, map.getPoint('Ice Cube').y + 16), 2000);
      }),
      wait(2000),
      ...sequenceItemsAfterFan(scene, iceCube, map, iceWall, ySort, userInterface, player, cam),
    ]);

  const states = createCallbackOnActivateOnce(scene, player, trigger, position, () => cutscene().start(), -22);

  ySort.add(container);

  return container.on('destroy', () => {
    states.destroy();
    sound.stop().destroy();
  });
};

export const createFan1On = (scene: Phaser.Scene, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Fan 1');

  const sprite = scene.add.sprite(0, -16, Sprite.Fan1Off);

  const coll = collision(scene, rect(-10, -2, 18, 2));

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const sound = spatialAudio(scene, Sound.IceCrack).loop().setPosition(position).setDistance(64).setVolume(0.2);

  const particles = scene.add
    .particles(position.x - 16, position.y - 16, Sprite.White1px, {
      lifespan: 800,
      speed: { min: 80, max: 100 },
      angle: { min: 180, max: 180 + 45 },
      alpha: { end: 1, start: 1 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-16, -16, 32, 32) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
      },
      gravityY: 0,
      frequency: 10,
      quantity: 1,
    })
    .setDepth(Depth.Main + 1)
    .stop();

  sprite.anims.play(Animation.Fan1);
  particles.start();
  sound.play();

  ySort.add(container).on('destroy', () => {
    sound.stop().destroy();
  });
};

export const createFan2 = (
  scene: Phaser.Scene,
  player: Player,
  map: Tilemap,
  ySort: YSortObjects,
  cam: Camera,
  iceCube: Phaser.GameObjects.Container,
  iceWall: Phaser.GameObjects.Container
) => {
  const position = map.getPoint('Fan 2');

  const sprite = scene.add.sprite(0, -16, Sprite.Fan1Off);

  const coll = collision(scene, rect(-10, -2, 18, 2));

  const trigger = collision(scene, map.getArea('Fan 2 Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const userInterface = ui(scene);

  const sound = spatialAudio(scene, Sound.IceCrack).loop().setPosition(position).setDistance(64).setVolume(0.2);

  const fanParticles = scene.add
    .particles(position.x - 16, position.y - 16, Sprite.White1px, {
      lifespan: 800,
      speed: { min: 80, max: 100 },
      angle: { min: 180 - 45, max: 180 },
      alpha: { end: 1, start: 1 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-16, -16, 32, 32) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
      },
      gravityY: 0,
      frequency: 10,
      quantity: 1,
    })
    .setDepth(Depth.Main + 1)
    .stop();

  const cutscene = () =>
    sequence(scene).of([
      runCallback(() => {
        setFlag(Flag.SummerIceCubeFan2Activated);
        player.disableUserInput();
        userInterface.showLetterbox();
        cam.zoom(2, 1000);
        cam.pauseFollow();
        cam.move(map.getPoint('Fan 2'), 2000);
      }),
      wait(2000),
      runCallback(() => {
        sprite.anims.play(Animation.Fan1);
        sound.play();
        fanParticles.start();
      }),
      wait(1000),
      runCallback(() => {
        cam.move(vec2(map.getPoint('Ice Cube').x, map.getPoint('Ice Cube').y + 16), 2000);
      }),
      wait(2000),
      ...sequenceItemsAfterFan(scene, iceCube, map, iceWall, ySort, userInterface, player, cam),
    ]);

  const states = createCallbackOnActivateOnce(scene, player, trigger, position, () => cutscene().start(), -22);

  ySort.add(container);

  return container.on('destroy', () => {
    states.destroy();
    sound.stop().destroy();
  });
};

export const createFan2On = (scene: Phaser.Scene, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Fan 2');

  const sprite = scene.add.sprite(0, -16, Sprite.Fan1Off);

  const coll = collision(scene, rect(-10, -2, 18, 2));

  const container = scene.add.container(position.x, position.y, [sprite, coll.toGameObject()]);

  const sound = spatialAudio(scene, Sound.IceCrack).loop().setPosition(position).setDistance(64).setVolume(0.2);

  const particles = scene.add
    .particles(position.x - 16, position.y - 16, Sprite.White1px, {
      lifespan: 800,
      speed: { min: 80, max: 100 },
      angle: { min: 180 - 45, max: 180 },
      alpha: { end: 1, start: 1 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-16, -16, 32, 32) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
      },
      gravityY: 0,
      frequency: 10,
      quantity: 1,
    })
    .setDepth(Depth.Main + 1)
    .stop();

  sprite.anims.play(Animation.Fan1);
  particles.start();
  sound.play();

  ySort.add(container).on('destroy', () => {
    sound.stop().destroy();
  });
};

export const createIceWall = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Wall');

  const sprite = scene.add.sprite(0, 0, Sprite.IceWall);

  const coll = collision(scene, map.getArea('Ice Wall Collision'));

  const trigger = collision(scene, map.getArea('Ice Wall Trigger')).notSolid();

  const container = scene.add.container(position.x, position.y, [sprite]).setDepth(Depth.Main + 1);

  const repeater = new Repeater([iceCubeWall1, iceCubeWall2], 'repeat last');

  const states = createDialogBoxStates(scene, player, trigger, position, () => repeater.currentItemThenNext());

  container.on('destroy', () => {
    states.destroy();
    trigger.destroy();
    coll.destroy();
  });

  return container;
};

export const createIceWallAfterPuzzle = (scene: Phaser.Scene, player: Player, map: Tilemap, ySort: YSortObjects) => {
  const position = map.getPoint('Ice Wall');

  const sprite = scene.add.sprite(0, 0, Sprite.IceWallBroken);

  const container = scene.add.container(position.x, position.y, [sprite]).setDepth(Depth.Main + 1);

  return container;
};

export const createSnowCaveIn = (scene: Phaser.Scene, map: Tilemap, player: Player) => {
  const sprite = scene.add.sprite(0, 0, Sprite.CaveIn1);

  const trigger = collision(scene, map.getArea('Snow Cave In Trigger')).notSolid();

  const position = map.getPoint('Snow Cave In');

  const arrow = scene.add
    .sprite(position.x, position.y - 16, Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main + 1)
    .setPipeline(Shader.Outline);

  const inputs = actionInput(scene);

  const repeater = new Repeater([snowCaveIn1, snowCaveIn2], 'repeat last');

  const dialog = () =>
    sequence(scene).of([
      runCallback(() => player.disableUserInput()),
      new PlayDialog(DialogBox.get(scene), repeater.currentItem()),
      runCallback(() => player.enableUserInput()),
      runCallback(() => state.change('idle')),
      runCallback(() => repeater.next()),
    ]);

  const state = states(scene, 'idle')
    .add('idle', ({ change }) => {
      arrow.setAlpha(0);

      if (trigger.intersects(player.collision)) change('active');
    })
    .add('active', ({ change }) => {
      arrow.setAlpha(1);

      if (!trigger.intersects(player.collision)) change('idle');

      if (inputs.isActive(Action.Action)) {
        dialog().start().destroyWhenComplete();
        arrow.setAlpha(0);
        change('dialog');
      }
    });

  const container = scene.add
    .container()
    .setPosition(position.x, position.y)
    .add(sprite)
    .setDepth(Depth.Main - 1);

  return container;
};

const sequenceItemsAfterFan = (
  scene: Phaser.Scene,
  iceCube: Phaser.GameObjects.Container,
  map: Tilemap,
  iceWall: Phaser.GameObjects.Container,
  ySort: YSortObjects,
  userInterface: UserInterface,
  player: Player,
  cam: Camera
): Sequenceable[] => {
  const fanCount = [checkFlag(Flag.SummerIceCubeFan1Activated), checkFlag(Flag.SummerIceCubeFan2Activated)].filter(
    (o) => !!o
  ).length;

  if (fanCount === 1) {
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
      .setDepth(Depth.Main + 1)
      .start();

    return [
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
        scene.sound.play(Sound.Explosion, { volume: 0.6 });
      }),
      wait(4000),
      new PlayDialog(DialogBox.get(scene), youHopeIceCubeIsOkay),
      wait(500),
      runCallback(() => {
        iceCube.destroy();
        iceWall.destroy();
        createIceWallAfterPuzzle(scene, player, map, ySort);
        createIceCubeAfterPuzzle(scene, player, map, ySort);
        createWindyArea(scene, player, map);
        userInterface.hideLetterbox();
        cam.zoom(1, 1000);
        cam.resumeFollow();
      }),
      wait(1000),
      runCallback(() => {
        player.enableUserInput();
      }),
    ];
  }

  return [
    new PlayDialog(DialogBox.get(scene), iceCubeOnOneFan),
    runCallback(() => {
      userInterface.hideLetterbox();
      cam.zoom(1, 1000);
      cam.resumeFollow();
    }),
    wait(1000),
    runCallback(() => {
      player.enableUserInput();
    }),
  ];
};

export const createWindyArea = (scene: Phaser.Scene, player: Player, map: Tilemap) => {
  const trigger = collision(scene, map.getArea('Fan Wind Trigger')).notSolid();

  createCallbackOnEnterAndExit(
    scene,
    trigger,
    player.collision,
    () => {
      player.disableUserInput();
      player.movement.setSpeed(128);
    },
    () => {
      player.enableUserInput();
      player.movement.setSpeed(40);
    },
    (delta) => {
      player.movement.setVelocity(
        vec2(player.movement.velocity().x - 128 * delta * 0.001, player.movement.velocity().y)
      );
    }
  );
};
