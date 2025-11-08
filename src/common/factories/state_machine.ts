import { Dialog } from 'common/objects/dialog_box';
import { Player } from 'common/objects/player';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { Action, Animation, Depth, Shader, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { Collision } from 'systems/collision';
import { runCallback, sequence } from 'systems/sequence';
import { states } from 'systems/states';
import { actionInput } from './input';

export const callbackOnEnterOnce = (scene: Phaser.Scene, trigger: Collision, player: Player, fn: () => void) => {
  const state = states(scene, 'idle')
    .add('idle', ({ change }) => {
      if (trigger.intersects(player.collision)) change('active');
    })
    .add('active', ({ change }) => {
      fn();
      change('inactive');
      state.destroy();
    });

  return state;
};

export const createDialogBoxStates = (
  scene: Phaser.Scene,
  player: Player,
  trigger: Collision,
  position: Phaser.Math.Vector2,
  resolveDialog: () => Dialog,
  shouldRunDialog?: () => boolean
) => {
  const arrow = scene.add
    .sprite(position.x, position.y - 16, Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main + 1)
    .setPipeline(Shader.Outline);

  const dialog = () =>
    sequence(scene).of([
      runCallback(() => player.disableUserInput()),
      new PlayDialog(DialogBox.get(scene), resolveDialog()),
      runCallback(() => player.enableUserInput()),
      runCallback(() => state.change('idle')),
    ]);

  const inputs = actionInput(scene);

  const state = states(scene, 'idle')
    .add('idle', ({ change }) => {
      arrow.setAlpha(0);

      if (trigger.intersects(player.collision)) change('active');
    })
    .add('active', ({ change }) => {
      if (shouldRunDialog?.() ?? true) {
        arrow.setAlpha(1);

        if (!trigger.intersects(player.collision)) change('idle');

        if (inputs.isActive(Action.Action)) {
          dialog().start().destroyWhenComplete();
          arrow.setAlpha(0);
          change('dialog');
        }
      } else {
        arrow.setAlpha(0);
      }
    });

  return state;
};

export const createCallbackOnActivateOnce = (
  scene: Phaser.Scene,
  player: Player,
  trigger: Collision,
  position: Phaser.Math.Vector2,
  fn: () => void
) => {
  const arrow = scene.add
    .sprite(position.x, position.y - 16, Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main + 1)
    .setPipeline(Shader.Outline);

  const inputs = actionInput(scene);

  states(scene, 'idle')
    .add('idle', ({ change }) => {
      arrow.setAlpha(0);

      if (trigger.intersects(player.collision)) change('active');
    })
    .add('active', ({ change }) => {
      arrow.setAlpha(1);

      if (!trigger.intersects(player.collision)) change('idle');

      if (inputs.isActive(Action.Action)) {
        fn();
        arrow.setAlpha(0);
        change('dialog');
      }
    });
};
