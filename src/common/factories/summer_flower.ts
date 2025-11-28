import { summerFlower } from 'common/conversations/summer';
import { Player } from 'common/objects/player';
import { Tilemap } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { fadeAudioVolume, getAudioSingleton, getWindAudio } from 'common/utils/getWindAudio';
import { Animation, Depth, Flag, Scene, Sound, Sprite } from 'constants';
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

  const sprite = scene.add.sprite(position.x, position.y, Sprite.MainPlantThirsty);

  sprite.anims.play(Animation.MainPlantThirsty);

  ySortObjects.add(sprite);

  const trigger = collision(scene, map.getArea('Trigger Flower Cutscene')).notSolid();

  const particles = scene.add
    .particles(position.x, position.y - 8, Sprite.White1px, {
      lifespan: 200,
      speed: { min: 80, max: 100 },
      angle: { min: 180 + 10, max: 180 + 180 - 10 },
      alpha: { end: 1, start: 1 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-8, -8, 16, 16) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
      },
      gravityY: 300,
      frequency: -1,
      quantity: 20,
    })
    .setDepth(Depth.Main + 1)
    .start();

  const watering = scene.sound.add(Sound.Watering, { loop: true, volume: 0 });
  watering.play();

  const cutscene = sequence(scene)
    .of([
      runCallback(() => setFlag(Flag.SummerWaterFlowerCutsceneWatched)),
      runCallback(() => {
        player.disableUserInput();
        player.movement.faceDirection(Phaser.Math.Vector2.LEFT);
      }),
      runCallback(() => ui(scene).showLetterbox()),
      runCallback(() => camera.zoom(2, 1000)),
      runCallback(() => player.movement.setSpeed(16)),
      wait(1000),
      runCallback(() => camera.pauseFollow().move(position, 2000)),
      wait(2200),
      new MoveToTarget(player.movement, map.getPoint('Next To Flower')),
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.LEFT)),
      wait(600),
      new PlayDialog(DialogBox.get(scene), summerFlower),
      wait(600),
      runCallback(() => {
        player.animator.playAnimation(Animation.PlayerWater);
        fadeAudioVolume(scene, watering, 0.1, 200);
      }),
      wait(3000),
      runCallback(() => {
        player.animator.playMovementAndIdleAnimations();
        fadeAudioVolume(scene, watering, 0, 200);
        particles.explode();
        sprite.anims.play(Animation.MainPlant);
      }),
      runCallback(() => player.animator.playMovementAndIdleAnimations()),
      wait(1000),
      runCallback(() => {
        watering.destroy();
        player.animator.playAnimation(Animation.PlayerRunRight, true);
      }),
      new MoveToTarget(player.movement, map.getPoint('Back From Flower')),
      runCallback(() => {
        player.animator.playAnimation(Animation.PlayerIdleRight, true);
      }),
      runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.DOWN)),
      wait(600),
      runCallback(() => player.sprite.anims.playReverse(Animation.PlayerWakeUp)),
      wait(2000),
      runCallback(() => {
        const music = getAudioSingleton(scene, Sound.MusicSummer);
        fadeAudioVolume(scene, music, 0, 4000);

        player.sprite.anims.play(Animation.PlayerSleep);
        player.sprite.flipX = false;
      }),
      wait(2000),
      runCallback(() => {
        ui(scene).fadeOut(2000);

        const wind = getWindAudio(scene);
        fadeAudioVolume(scene, wind, 0);
      }),
      wait(2000),
      runCallback(() => scene.scene.start(Scene.AutumnTitle)),
    ])
    .destroyWhenComplete();

  callbackOnEnterOnce(scene, trigger, player, () => {
    cutscene.start();
  });
};
