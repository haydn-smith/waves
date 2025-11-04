import { OtherPenguin } from 'common/objects/other_penguin';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, Depth, Sprite } from 'constants';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { runCallback, sequence, wait } from 'systems/sequence';
import { states } from 'systems/states';
import { ui } from 'systems/ui';
import { actionInput } from './input';

export const createOtherPenguinCutscene = (
  scene: Phaser.Scene,
  player: Player,
  penguin: OtherPenguin,
  camera: Camera,
  map: Tilemap
) => {
  const trigger = collision(scene, map.getArea('Other Penguin Conversation Trigger')).notSolid();

  const inputs = actionInput(scene);

  const downArrow = scene.add
    .sprite(penguin.x, penguin.y - scaled(24), Sprite.DownArrow)
    .play(Animation.DownArrow)
    .setDepth(Depth.Main + 1);

  const cutscene = sequence(scene)
    .of([
      runCallback(() => player.disableUserInput()),
      runCallback(() => ui(scene).showLetterbox()),
      runCallback(() => camera.zoom(2, 800)),
      wait(800),
      runCallback(() => player.movement.moveTo(map.getPoint('Player Spot for Conversation'))),
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.LEFT)),
      // dialog
      // walk to jetty
      // dialog again
      // swim away
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
