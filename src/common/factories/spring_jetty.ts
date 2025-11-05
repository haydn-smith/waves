import { otherPenguinGoodbye, otherPenguinHello } from 'common/conversations/spring';
import { OtherPenguin } from 'common/objects/other_penguin';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, Depth, Flag, Shader, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { Camera } from 'systems/camera';
import { Collision, collision } from 'systems/collision';
import { setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { states } from 'systems/states';
import { ui } from 'systems/ui';
import { actionInput } from './input';

export const createOtherPenguinCutscene = (
  scene: Phaser.Scene,
  player: Player,
  penguin: OtherPenguin,
  camera: Camera,
  map: Tilemap,
  blockPlayerFromExit: Collision
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
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.LEFT)),
      new PlayDialog(DialogBox.get(scene), otherPenguinHello),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 1')),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 2')),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 3')),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 4')),
      runCallback(() => player.movement.moveTo(map.getPoint('Player Start'))),
      new MoveToTarget(penguin.movement, map.getPoint('Other Penguin Nav 5')),
      new PlayDialog(DialogBox.get(scene), otherPenguinGoodbye),
      // TODO: Swim away.
      wait(1000),
      runCallback(() => camera.zoom(1, 800)),
      runCallback(() => ui(scene).hideLetterbox()),
      wait(800),
      runCallback(() => {
        player.enableUserInput();
        trigger.destroy();
        inputs.destroy();
      }),
    ])
    .destroyWhenComplete();

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
        cutscene.start();
        downArrow.destroy();
        state.destroy();
        change('idle');
      }
    });
};
