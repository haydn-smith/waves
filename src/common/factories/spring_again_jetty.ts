import {
  iceCubeLeaves1,
  iceCubeLeaves2,
  snowBarrier1,
  snowBarrier2,
  snowmanLeaves1,
  snowmanLeaves2,
} from 'common/conversations/spring_again';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { Repeater } from 'common/utils/repeater';
import { Depth, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { movement } from 'systems/movement';
import { runCallback, sequence, wait } from 'systems/sequence';
import { RunTween } from 'systems/sequence/sequences/run_tween';
import { ui } from 'systems/ui';
import { rect } from './phaser';
import { callbackOnEnterOnce, createDialogBoxStates } from './state_machine';

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
          camera.zoom(2);
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
          camera.zoom(2);
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

  const sprite = scene.add.sprite(0, 0, Sprite.Unknown);

  const body = collision(scene, map.getArea('Block Player From Exit'));

  const area = collision(scene, map.getArea('Snow Barrier Interaction')).notSolid();

  const repeater = new Repeater([snowBarrier1, snowBarrier2], 'repeat last');

  container.add([sprite]);

  const states = createDialogBoxStates(scene, player, area, map.getPoint('Snow Barrier'), () =>
    repeater.currentItemThenNext()
  );
};
