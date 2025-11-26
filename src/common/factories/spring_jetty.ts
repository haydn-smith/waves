import { otherPenguinGoodbye, otherPenguinHello } from 'common/conversations/spring';
import { Jetty } from 'common/objects/jetty';
import { OtherPenguin } from 'common/objects/other_penguin';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, Depth, Flag, Shader, Sound, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { audio } from 'systems/audio';
import { Camera } from 'systems/camera';
import { Collision, collision } from 'systems/collision';
import { setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { RunTween } from 'systems/sequence/sequences/run_tween';
import { states } from 'systems/states';
import { ui } from 'systems/ui';
import { actionInput } from './input';
import { vec2 } from './phaser';

export const createOtherPenguinCutscene = (
  scene: Phaser.Scene,
  player: Player,
  penguin: OtherPenguin,
  camera: Camera,
  map: Tilemap,
  blockPlayerFromExit: Collision,
  jetty: Jetty
) => {
  const trigger = collision(scene, map.getArea('Other Penguin Conversation Trigger')).notSolid();

  const inputs = actionInput(scene);

  const downArrow = scene.add
    .sprite(penguin.x, penguin.y - scaled(24), Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main + 1)
    .setPipeline(Shader.Outline);

  const cutscene = sequence(scene)
    .of([
      runCallback(() => blockPlayerFromExit.destroy()),
      runCallback(() => setFlag(Flag.OtherPenguinCutsceneWatched)),
      runCallback(() => player.disableUserInput()),
      runCallback(() => ui(scene).showLetterbox()),
      runCallback(() => camera.zoom(2, 800)),
      wait(800),
      new MoveToTarget(player.movement, map.getPoint('Player Spot for Conversation')),
      wait(100),
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.LEFT)),
      new PlayDialog(DialogBox.get(scene), otherPenguinHello),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 1')),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 2')),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 3')),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 4')),
      runCallback(() => player.movement.moveTo(map.getPoint('Player Start'))),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 5')),
      wait(100),
      runCallback(() => {
        jetty.collisionOff();
        player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
        penguin.movement.faceDirection(Phaser.Math.Vector2.LEFT);
      }),
      wait(1000),
      runCallback(() => {
        player.animator.playAnimation(Animation.PlayerIdleRight, false);
        player.movement.setSpeed(8);
      }),
      new MoveToTarget(player.movement, vec2(map.getPoint('Player Start').x - 4, map.getPoint('Player Start').y)),
      wait(100),
      runCallback(() => {
        player.animator.playMovementAndIdleAnimations();
        player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
      }),
      wait(1000),
      runCallback(() => {
        player.animator.playAnimation(Animation.PlayerIdleRight, false);
      }),
      new MoveToTarget(player.movement, vec2(map.getPoint('Player Start').x - 8, map.getPoint('Player Start').y)),
      wait(100),
      runCallback(() => {
        player.movement.setSpeed(40);
        player.animator.playMovementAndIdleAnimations();
        player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
      }),
      new PlayDialog(DialogBox.get(scene), otherPenguinGoodbye),
      wait(1000),
      new MoveToTarget(penguin.movement, map.getPoint('Edge')),
      wait(100),
      runCallback(() => penguin.animator.playAnimation(Animation.PlayerIdleRight)),
      new RunTween(scene, {
        targets: penguin,
        x: map.getPoint('Peak').x,
        y: map.getPoint('Peak').y,
        ease: Phaser.Math.Easing.Cubic.Out,
        duration: 500,
      }),
      new RunTween(scene, {
        targets: penguin,
        x: map.getPoint('Water').x,
        y: map.getPoint('Water').y,
        ease: Phaser.Math.Easing.Cubic.In,
        duration: 500,
      }),
      runCallback(() => {
        scene.sound.play(Sound.Splash, { volume: 0.4 });

        penguin.animator.setMovementAnimations(
          Animation.PlayerSwimUp,
          Animation.PlayerSwimDown,
          Animation.PlayerSwimRight
        );

        penguin.animator.setIdleAnimations(Animation.PlayerSwimUp, Animation.PlayerSwimDown, Animation.PlayerSwimRight);

        penguin.animator.playMovementAndIdleAnimations();
      }),
      wait(1000),
      runCallback(() => penguin.movement.setSpeed(16)),
      new MoveToTarget(penguin.movement, map.getPoint('Swim To')),
      wait(1000),
      runCallback(() => {
        penguin.destroy();
        camera.zoom(1, 800);
      }),
      runCallback(() => ui(scene).hideLetterbox()),
      wait(800),
      runCallback(() => {
        jetty.collisionOn();
        player.enableUserInput();
        trigger.destroy();
        inputs.destroy();
      }),
    ])
    .destroyWhenComplete();

  const activate = audio(scene, Sound.Activate);

  const state = states(scene, 'not triggered')
    .add('not triggered', ({ change }) => {
      downArrow.setAlpha(0);

      if (trigger.intersects(player.collision)) {
        change('triggered');
      }
    })
    .add('triggered', ({ change }) => {
      downArrow.setAlpha(1);

      if (!trigger.intersects(player.collision)) {
        change('not triggered');
      }

      if (inputs.isActive(Action.Action)) {
        activate.dontLoop().play();
        cutscene.start();
        downArrow.destroy();
        state.destroy();
        change('idle');
      }
    });
};
