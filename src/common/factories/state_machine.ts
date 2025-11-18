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

export const createCallbackOnEnterAndExit = (
  scene: Phaser.Scene,
  trigger: Collision,
  other: Collision,
  enterFn: () => void,
  exitFn?: () => void,
  collidingFn?: (delta: number) => void
) => {
  const state = states(scene, 'idle')
    .add('idle', ({ change }) => {
      if (trigger.intersects(other)) {
        enterFn();
        change('active');
      }
    })
    .add('active', ({ change, delta }) => {
      collidingFn?.(delta);

      if (!trigger.intersects(other)) {
        exitFn?.();
        change('idle');
      }
    });

  return state;
};

export const createCallbackOnAnyEnterAndExit = (
  scene: Phaser.Scene,
  trigger: Collision,
  enterFn: (intersects: Collision) => void,
  exitFn?: (intersects: Collision) => void
) => {
  let intersects: Collision[] = [];

  const state = states(scene, 'idle').add('idle', () => {
    const newIntersects = trigger.intersections();

    const newOnes = newIntersects.filter((i) => !intersects.find((i2) => i2.toGameObject() === i.toGameObject()));

    const oldOnes = intersects.filter((i) => !newIntersects.find((i2) => i2.toGameObject() === i.toGameObject()));

    intersects = newIntersects;

    if (newOnes.length) {
      enterFn(newOnes[0]);
    }

    if (oldOnes.length) {
      exitFn?.(oldOnes[0]);
    }
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

  state.toGameObject().on('destroy', () => {
    arrow.destroy();
    inputs.destroy();
  });

  return state;
};

export const createCallbackOnActivateOnce = (
  scene: Phaser.Scene,
  player: Player,
  trigger: Collision,
  position: Phaser.Math.Vector2,
  fn: () => void,
  arrowYOffset: number = 0
) => {
  const arrow = scene.add
    .sprite(position.x, position.y - 16 + arrowYOffset, Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main + 1)
    .setPipeline(Shader.Outline);

  const inputs = actionInput(scene);

  const state = states(scene, 'idle')
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

  state.toGameObject().on('destroy', () => {
    arrow.destroy();
    inputs.destroy();
  });

  return state;
};
