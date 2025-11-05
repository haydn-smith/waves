import { iceCube1, iceCube2, iceCube3, snowCaveIn1 } from 'common/conversations/spring';
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
import { rect } from './phaser';

export const createIceCube = (scene: Phaser.Scene, map: Tilemap, player: Player) => {
  const sprite = scene.add.sprite(0, 0, Sprite.PlayerIdle).setPipeline(Shader.Outline);

  const body = collision(scene, rect(0, 0, 8, 8));

  const trigger = collision(scene, map.getArea('Ice Cube Trigger')).notSolid();

  const position = map.getPoint('Ice Cube');

  const arrow = scene.add
    .sprite(position.x, position.y - 16, Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main + 1)
    .setPipeline(Shader.Outline);

  const inputs = actionInput(scene);

  const repeater = new Repeater([iceCube1, iceCube2, iceCube3], 'repeat last');

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

  const container = scene.add.container().setPosition(position.x, position.y).add(sprite).add(body.toGameObject());

  return container;
};

export const createSnowCaveIn = (scene: Phaser.Scene, map: Tilemap, player: Player) => {
  const sprite = scene.add.sprite(0, 0, Sprite.PlayerIdle).setPipeline(Shader.Outline);

  collision(scene, map.getArea('Snow Cave In Body'));

  const trigger = collision(scene, map.getArea('Snow Cave In Trigger')).notSolid();

  const position = map.getPoint('Snow Cave In');

  const arrow = scene.add
    .sprite(position.x, position.y - 16, Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main + 1)
    .setPipeline(Shader.Outline);

  const inputs = actionInput(scene);

  const repeater = new Repeater([snowCaveIn1], 'repeat last');

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
