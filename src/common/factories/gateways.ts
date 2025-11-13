import { Player } from 'common/objects/player';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { getData, setData } from 'common/utils/data';
import { TypeOfScene } from 'constants';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { runCallback, sequence, wait } from 'systems/sequence';
import { states } from 'systems/states';
import { ui } from 'systems/ui';

export const createGateway = (
  scene: Phaser.Scene,
  rectangle: Phaser.Geom.Rectangle,
  player: Player,
  camera: Camera,
  direction: Phaser.Math.Vector2,
  nextScene: TypeOfScene,
  currScene: TypeOfScene,
  onEnteredGateway?: () => void
) => {
  const trigger = collision(scene, rectangle).notSolid();

  const rectangeCenter = new Phaser.Math.Vector2(rectangle.x + rectangle.width / 2, rectangle.y + rectangle.height / 2);

  const moveTo = rectangeCenter.clone().add(direction.clone().multiply(new Phaser.Math.Vector2(20, 20)));

  const moveFrom = rectangeCenter.clone().add(direction.clone().multiply(new Phaser.Math.Vector2(-20, -20)));

  const prevScene = getData('previousScene');

  // ui(scene).black();

  const state = states(scene, 'initial')
    .add('initial', ({ change }) => {
      if (prevScene === nextScene) {
        sequence(scene)
          .of([
            runCallback(() => player.setPosition(moveFrom.x, moveFrom.y)),
            runCallback(() => camera.follow(player)),
            runCallback(() => player.disableUserInput()),
            runCallback(() =>
              sequence(scene)
                .of([wait(500), runCallback(() => ui(scene).fadeIn(500))])
                .destroyWhenComplete()
                .start()
            ),
            new MoveToTarget(player.movement, moveTo),
            runCallback(() => player.enableUserInput()),
            runCallback(() => change('not active')),
            runCallback(() => onEnteredGateway?.()),
          ])
          .destroyWhenComplete()
          .start();

        change('idle');
      } else {
        change('not active');
      }
    })
    .add('not active', ({ change }) => {
      if (trigger.intersects(player.collision)) {
        change('active');

        sequence(scene)
          .of([
            runCallback(() => player.disableUserInput()),
            runCallback(() => player.movement.moveTo(moveFrom)),
            runCallback(() => ui(scene).fadeOut(500)),
            wait(500),
            runCallback(() => setData('previousScene', currScene)),
            runCallback(() => scene.scene.start(nextScene)),
          ])
          .destroyWhenComplete()
          .start();
      }
    });

  return state;
};
