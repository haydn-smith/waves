import { autumnFlower } from 'common/conversations/autumn';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { Flag, Scene, Sprite } from 'constants';
import { DialogBox } from 'scenes/dialog_box';
import { Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';
import { callbackOnEnterOnce } from './state_machine';

export const createFlower = (
  scene: Phaser.Scene,
  map: Tilemap,
  player: Player,
  ySortObjects: YSortObjects,
  camera: Camera
) => {
  const position = map.getPoint('Flower');

  const sprite = scene.add.sprite(position.x, position.y, Sprite.MainPlant);

  ySortObjects.add(sprite);

  const trigger = collision(scene, map.getArea('Trigger Flower Cutscene')).notSolid();

  const cutscene = sequence(scene)
    .of([
      runCallback(() => setFlag(Flag.AutumnWaterFlowerCutsceneWatched)),
      runCallback(() => player.disableUserInput()),
      runCallback(() => ui(scene).showLetterbox()),
      runCallback(() => camera.zoom(2, 1000)),
      runCallback(() => player.movement.setSpeed(16)),
      wait(1000),
      runCallback(() => camera.pauseFollow().move(position, 2000)),
      wait(2200),
      new MoveToTarget(player.movement, map.getPoint('Next To Flower')),
      wait(1000),
      new PlayDialog(DialogBox.get(scene), autumnFlower),
      wait(1000),
      runCallback(() => player.water()),
      wait(3000),
      runCallback(() => player.runnningAround()),
      wait(1000),
      new MoveToTarget(player.movement, map.getPoint('Back From Flower')),
      wait(1000),
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.LEFT)),
      runCallback(() => player.sleep()),
      wait(3000),
      runCallback(() => ui(scene).fadeOut(3000)),
      wait(3000),
      runCallback(() => scene.scene.start(Scene.AutumnTitle)),
    ])
    .destroyWhenComplete();

  callbackOnEnterOnce(scene, trigger, player, () => {
    cutscene.start();
  });
};
