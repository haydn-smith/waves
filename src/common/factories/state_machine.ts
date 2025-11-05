import { Player } from 'common/objects/player';
import { Collision } from 'systems/collision';
import { states } from 'systems/states';

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
