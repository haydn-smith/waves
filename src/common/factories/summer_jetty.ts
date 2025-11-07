import { meltedSnow1_1, meltedSnow1_2, meltedSnow1_3, meltedSnow2_1, meltedSnow2_2 } from 'common/conversations/summer';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { Repeater } from 'common/utils/repeater';
import { Action, Animation, Depth, Shader, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { collision } from 'systems/collision';
import { runCallback, sequence } from 'systems/sequence';
import { states } from 'systems/states';
import { actionInput } from './input';

export const createMeltedSnow1 = (scene: Phaser.Scene, player: Player, map: Tilemap) => {
  const sprite = scene.add.sprite(0, 0, Sprite.PlayerIdle).setPipeline(Shader.Outline);

  const trigger = collision(scene, map.getArea('Melted Snow 1 Trigger')).notSolid();

  const position = map.getPoint('Melted Snow 1');

  const arrow = scene.add
    .sprite(position.x, position.y - 16, Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main - 1)
    .setPipeline(Shader.Outline);

  const inputs = actionInput(scene);

  const repeater = new Repeater([meltedSnow1_1, meltedSnow1_2, meltedSnow1_3], 'repeat last');

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

  const container = scene.add.container().setPosition(position.x, position.y).add(sprite).setDepth(Depth.Foreground);

  return container;
};

export const createMeltedSnow2 = (scene: Phaser.Scene, player: Player, map: Tilemap) => {
  const sprite = scene.add.sprite(0, 0, Sprite.PlayerIdle).setPipeline(Shader.Outline);

  const trigger = collision(scene, map.getArea('Melted Snow 2 Trigger')).notSolid();

  const position = map.getPoint('Melted Snow 2');

  const arrow = scene.add
    .sprite(position.x, position.y - 16, Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main - 1)
    .setPipeline(Shader.Outline);

  const inputs = actionInput(scene);

  const repeater = new Repeater([meltedSnow2_1, meltedSnow2_2], 'repeat last');

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

  const container = scene.add.container().setPosition(position.x, position.y).add(sprite).setDepth(Depth.Foreground);

  return container;
};
