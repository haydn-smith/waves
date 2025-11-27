import {
  iceCubeLeaves1,
  iceCubeLeaves2,
  playerLeaves,
  snowBarrier1,
  snowBarrier2,
  snowmanLeaves1,
  snowmanLeaves2,
} from 'common/conversations/spring_again';
import { Jetty } from 'common/objects/jetty';
import { Player } from 'common/objects/player';
import { Snowman } from 'common/objects/snowman';
import { Tilemap } from 'common/objects/tilemap';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { Repeater } from 'common/utils/repeater';
import { Animation, Depth, Flag, Scene, Sound, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { checkFlag, setFlag } from 'systems/flags';
import { movement, Movement as MovementDecorator } from 'systems/movement';
import { Movement } from 'systems/movement/objects/movement';
import { runCallback, sequence, wait } from 'systems/sequence';
import { RunTween } from 'systems/sequence/sequences/run_tween';
import { ui } from 'systems/ui';
import { rect } from './phaser';
import { callbackOnEnterOnce, createCallbackOnEnterAndExit, createDialogBoxStates } from './state_machine';

export const createSnowman = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera) => {
  const container = scene.add.container(map.getPoint('Snowman').x, map.getPoint('Snowman').y);

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown);

  const body = collision(scene, rect(-2, -2, 4, 4));

  const area = collision(scene, map.getArea('Snowman Interaction')).notSolid();

  const move = movement(scene, container, body).setSpeed(8);

  container.add([sprite, body.toGameObject()]);

  const states = callbackOnEnterOnce(scene, area, player, () => {
    sequence(scene)
      .of([
        runCallback(() => {
          player.disableUserInput();
          ui(scene).showLetterbox();
          camera.zoom(2, 1000);
        }),
        new MoveToTarget(player.movement, map.getPoint('In Front Of Snowman')),
        runCallback(() => {
          player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
        }),
        wait(1000),
        new PlayDialog(DialogBox.get(scene), snowmanLeaves1),
        wait(1000),
        new MoveToTarget(move, map.getPoint('Snowman Edge')),
        wait(1000),
        new PlayDialog(DialogBox.get(scene), snowmanLeaves2),
        new RunTween(scene, {
          targets: container,
          x: map.getPoint('Snowman Peak').x,
          y: map.getPoint('Snowman Peak').y,
          ease: Phaser.Math.Easing.Quintic.In,
          duration: 1000,
        }),
        new RunTween(scene, {
          targets: container,
          x: map.getPoint('Snowman Water').x,
          y: map.getPoint('Snowman Water').y,
          ease: Phaser.Math.Easing.Quintic.Out,
          duration: 1000,
        }),
        wait(1000),
        runCallback(() => move.setSpeed(16)),
        new MoveToTarget(move, map.getPoint('Snowman Swim To')),
        runCallback(() => {
          container.destroy();
          player.enableUserInput();
          ui(scene).hideLetterbox();
          camera.zoom(1, 1000);
        }),
      ])
      .start()
      .destroyWhenComplete();
  });

  return container.on('destroy', () => {
    area.destroy();
    states.destroy();
    move.destroy();
  });
};

export const createSnowman2 = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera) => {
  const snowman = scene.add.existing(new Snowman(scene));

  snowman.setPosition(map.getPoint('Snowman').x, map.getPoint('Snowman').y);

  const area = collision(scene, map.getArea('Snowman Interaction')).notSolid();

  const states = callbackOnEnterOnce(scene, area, player, () => {
    sequence(scene)
      .of([
        runCallback(() => {
          setFlag(Flag.FinalSnowmanCutsceneWatched);
          player.disableUserInput();
          ui(scene).showLetterbox();
          camera.zoom(2, 1000);
        }),
        new MoveToTarget(player.movement, map.getPoint('In Front Of Snowman')),
        runCallback(() => {
          player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
        }),
        wait(1000),
        new PlayDialog(DialogBox.get(scene), snowmanLeaves1),
        wait(1000),
        runCallback(() => snowman.movement.setSpeed(16)),
        new MoveToTarget(snowman.movement, map.getPoint('To Jetty 1')),
        new MoveToTarget(snowman.movement, map.getPoint('To Jetty 2')),
        runCallback(() => {
          snowman.coll.notSolid();
          player.enableUserInput();
          ui(scene).hideLetterbox();
          camera.zoom(1, 1000);
        }),
      ])
      .start()
      .destroyWhenComplete();
  });

  return snowman.on('destroy', () => {
    states.destroy();
  });
};

export const createIceCube = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera) => {
  const container = scene.add.container(map.getPoint('Ice Cube').x, map.getPoint('Ice Cube').y);

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown);

  const body = collision(scene, rect(-2, -2, 4, 4));

  const area = collision(scene, map.getArea('Ice Cube Interaction')).notSolid();

  const move = movement(scene, container, body).setSpeed(8);

  container.add([sprite, body.toGameObject()]);

  const states = callbackOnEnterOnce(scene, area, player, () => {
    sequence(scene)
      .of([
        runCallback(() => {
          player.disableUserInput();
          ui(scene).showLetterbox();
          camera.zoom(2, 1000);
        }),
        new MoveToTarget(player.movement, map.getPoint('In Front Of Ice Cube')),
        runCallback(() => {
          player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
        }),
        wait(1000),
        new PlayDialog(DialogBox.get(scene), iceCubeLeaves1),
        wait(1000),
        new MoveToTarget(move, map.getPoint('Ice Cube Edge')),
        wait(1000),
        new PlayDialog(DialogBox.get(scene), iceCubeLeaves2),
        new RunTween(scene, {
          targets: container,
          x: map.getPoint('Ice Cube Peak').x,
          y: map.getPoint('Ice Cube Peak').y,
          ease: Phaser.Math.Easing.Quintic.In,
          duration: 1000,
        }),
        new RunTween(scene, {
          targets: container,
          x: map.getPoint('Ice Cube Water').x,
          y: map.getPoint('Ice Cube Water').y,
          ease: Phaser.Math.Easing.Quintic.Out,
          duration: 1000,
        }),
        wait(1000),
        runCallback(() => move.setSpeed(16)),
        new MoveToTarget(move, map.getPoint('Ice Cube Swim To')),
        runCallback(() => {
          container.destroy();
          player.enableUserInput();
          ui(scene).hideLetterbox();
          camera.zoom(1, 1000);
        }),
      ])
      .start()
      .destroyWhenComplete();
  });

  return container.on('destroy', () => {
    area.destroy();
    states.destroy();
    move.destroy();
  });
};

export const createSnowBarrier = (scene: Phaser.Scene, player: Player, map: Tilemap) => {
  const container = scene.add
    .container(map.getPoint('Snow Barrier').x, map.getPoint('Snow Barrier').y)
    .setDepth(Depth.Main + 1);

  const sprite = scene.add.sprite(0, 0, Sprite.CaveInSpringAgain);

  const body = collision(scene, map.getArea('Block Player From Exit'));

  const area = collision(scene, map.getArea('Snow Barrier Interaction')).notSolid();

  const repeater = new Repeater([snowBarrier1, snowBarrier2], 'repeat last');

  container.add([sprite]);

  const states = createDialogBoxStates(scene, player, area, map.getPoint('Snow Barrier'), () =>
    repeater.currentItemThenNext()
  );
};

export const createIceCube2 = (scene: Phaser.Scene, player: Player, map: Tilemap, camera: Camera) => {
  const container = scene.add.container(map.getPoint('Ice Cube').x, map.getPoint('Ice Cube').y);

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown).setName('Sprite');

  sprite.flipX = true;

  sprite.anims.play(Animation.IceCubeRight);

  const body = collision(scene, rect(-4, 5, 8, 2));

  const area = collision(scene, map.getArea('Ice Cube Interaction')).notSolid();

  const move = movement(scene, container, body).setSpeed(16);

  container.add([sprite, body.toGameObject(), move.toGameObject().setName('Movement')]);

  const states = callbackOnEnterOnce(scene, area, player, () => {
    sequence(scene)
      .of([
        runCallback(() => {
          setFlag(Flag.FinalIceCubeCutsceneWatched);
          player.disableUserInput();
          ui(scene).showLetterbox();
          camera.zoom(2, 1000);
        }),
        new MoveToTarget(player.movement, map.getPoint('In Front Of Ice Cube')),
        runCallback(() => {
          player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
        }),
        wait(1000),
        new PlayDialog(DialogBox.get(scene), iceCubeLeaves1),
        wait(1000),
        runCallback(() => {
          sprite.flipX = false;
          move.setSpeed(16);
        }),
        new MoveToTarget(move, map.getPoint('To Jetty 1')),
        new MoveToTarget(move, map.getPoint('To Jetty 3')),
        runCallback(() => {
          player.enableUserInput();
          ui(scene).hideLetterbox();
          camera.zoom(1, 1000);
        }),
      ])
      .start()
      .destroyWhenComplete();
  });

  return container.on('destroy', () => {
    area.destroy();
    states.destroy();
    move.destroy();
  });
};

export const createFinalCutscene = (
  scene: Phaser.Scene,
  map: Tilemap,
  camera: Camera,
  player: Player,
  snowman: Snowman,
  iceCube: Phaser.GameObjects.Container,
  jetty: Jetty
) => {
  const area = collision(scene, map.getArea('Final Cutscene Area')).notSolid();

  const states = createCallbackOnEnterAndExit(scene, area, player.collision, () => {
    if (!checkFlag(Flag.FinalSnowmanCutsceneWatched) || !checkFlag(Flag.FinalIceCubeCutsceneWatched)) {
      return;
    }

    sequence(scene)
      .of([
        runCallback(() => {
          setFlag(Flag.GameComplete);
          player.disableUserInput();
          ui(scene).showLetterbox();
          camera.zoom(2, 1000);
          snowman.movement.setSpeed(8);
          jetty.collisionOff();
          player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
        }),
        wait(1000),

        new MoveToTarget(snowman.movement, map.getPoint('Edge')),
        new PlayDialog(DialogBox.get(scene), snowmanLeaves2),
        wait(1000),
        new RunTween(scene, {
          targets: snowman,
          x: map.getPoint('Peak').x,
          y: map.getPoint('Peak').y,
          ease: Phaser.Math.Easing.Cubic.Out,
          duration: 500,
        }),
        new RunTween(scene, {
          targets: snowman,
          x: map.getPoint('Water').x,
          y: map.getPoint('Water').y,
          ease: Phaser.Math.Easing.Cubic.In,
          duration: 500,
        }),
        runCallback(() => {
          scene.sound.play(Sound.Splash, { volume: 0.4 });
          snowman.sprite.anims.play(Animation.SnowmanSwimRight);
        }),
        wait(1000),
        runCallback(() => snowman.movement.setSpeed(16)),
        new MoveToTarget(snowman.movement, map.getPoint('Swim To')),
        runCallback(() => snowman.destroy()),

        wait(1000),
        new MoveToTarget(new MovementDecorator(iceCube.getByName('Movement') as Movement), map.getPoint('Edge')),
        new PlayDialog(DialogBox.get(scene), iceCubeLeaves2),
        wait(1000),
        new RunTween(scene, {
          targets: iceCube,
          x: map.getPoint('Peak').x,
          y: map.getPoint('Peak').y,
          ease: Phaser.Math.Easing.Cubic.Out,
          duration: 500,
        }),
        new RunTween(scene, {
          targets: iceCube,
          x: map.getPoint('Water').x,
          y: map.getPoint('Water').y,
          ease: Phaser.Math.Easing.Cubic.In,
          duration: 500,
        }),
        runCallback(() => {
          scene.sound.play(Sound.Splash, { volume: 0.4 });
          iceCube.getByName('Sprite').anims.play(Animation.IceCubeSwimRight);
        }),
        wait(1000),
        runCallback(() => (iceCube.getByName('Movement') as Movement).setSpeed(16)),
        new MoveToTarget(new MovementDecorator(iceCube.getByName('Movement') as Movement), map.getPoint('Swim To')),
        runCallback(() => iceCube.destroy()),

        wait(1000),
        new MoveToTarget(player.movement, map.getPoint('Edge')),
        runCallback(() => camera.unfollow()),
        new PlayDialog(DialogBox.get(scene), playerLeaves),
        wait(500),
        runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.DOWN)),
        wait(800),
        runCallback(() => player.animator.playAnimation(Animation.PlayerWave)),
        wait(1000),
        runCallback(() => {
          player.movement.faceDirection(Phaser.Math.Vector2.DOWN);
          player.animator.playMovementAndIdleAnimations();
        }),
        wait(1000),
        runCallback(() => player.animator.playAnimation(Animation.PlayerIdleRight)),
        wait(400),
        new RunTween(scene, {
          targets: player,
          x: map.getPoint('Peak').x,
          y: map.getPoint('Peak').y,
          ease: Phaser.Math.Easing.Cubic.Out,
          duration: 500,
        }),
        new RunTween(scene, {
          targets: player,
          x: map.getPoint('Water').x,
          y: map.getPoint('Water').y,
          ease: Phaser.Math.Easing.Cubic.In,
          duration: 500,
        }),
        runCallback(() => {
          scene.sound.play(Sound.Splash, { volume: 0.4 });

          player.animator.setMovementAnimations(
            Animation.PlayerSwimRight,
            Animation.PlayerSwimRight,
            Animation.PlayerSwimRight
          );

          player.animator.setIdleAnimations(
            Animation.PlayerSwimRight,
            Animation.PlayerSwimRight,
            Animation.PlayerSwimRight
          );

          player.animator.playMovementAndIdleAnimations();
        }),
        wait(1000),
        runCallback(() => player.movement.setSpeed(16)),
        new MoveToTarget(player.movement, map.getPoint('Swim To')),
        runCallback(() => {
          camera.move(map.getPoint('Snow Barrier'), 9000, Phaser.Math.Easing.Cubic.In);
        }),
        wait(8000),
        runCallback(() => {
          ui(scene).fadeOut(1000);
        }),
        wait(1000),
        runCallback(() => scene.scene.start(Scene.SpringAgainFlower)),
      ])
      .start();
  });
};
