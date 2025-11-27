import {
  completeSnowman,
  snowmanWithOneSnow,
  snowmanWithThreeSnow,
  snowmanWithTwoSnow,
} from 'common/conversations/autumn';
import { createSnow1, createSnow2, createSnow3, createSnowman } from 'common/factories/autumn_snowman';
import { createGateway } from 'common/factories/gateways';
import { Dialog } from 'common/objects/dialog_box';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Storm } from 'common/objects/storm';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { logEvent } from 'common/utils/log';
import { CollisionMask, Depth, Flag, Scene, Sound, Sprite, Tilemap, TypeOfFlag } from 'constants';
import { camera } from 'systems/camera';
import { collisionBorder } from 'systems/collision';
import { checkFlag, setFlag } from 'systems/flags';
import { runCallback, Sequence, sequence, wait } from 'systems/sequence';
import { RunCallback } from 'systems/sequence/sequences/run_callback';
import { Wait } from 'systems/sequence/sequences/wait';
import { ui } from 'systems/ui';
import { DialogBox } from './dialog_box';

export class AutumnSnowman extends Phaser.Scene {
  private isSnowmanDialogActive: boolean;

  constructor() {
    super(Scene.AutumnSnowman);
  }

  create() {
    logEvent('Creating "Autumn Snowman" scene.');

    this.add.existing(new Storm(this));
    const map = new TilemapObject(this, Tilemap.AutumnSnowman);

    const player = new Player(this).addToDisplayList().addToUpdateList();

    const ySort = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    ySort.add(player);

    map.forPoints('Snow 1', (v) => ySort.add(this.add.existing(new Snow(this, Sprite.Snow1).setPosition(v.x, v.y))));
    map.forPoints('Snow 2', (v) => ySort.add(this.add.existing(new Snow(this, Sprite.Snow2).setPosition(v.x, v.y))));
    map.forPoints('Snow 3', (v) => ySort.add(this.add.existing(new Snow(this, Sprite.Snow3).setPosition(v.x, v.y))));
    map.forPoints('Snow 4', (v) => ySort.add(this.add.existing(new Snow(this, Sprite.Snow4).setPosition(v.x, v.y))));
    map.forPoints('Push Area Image', (v) =>
      this.add
        .sprite(0, 0, Sprite.PushAreaImage)
        .setPosition(v.x, v.y)
        .setDepth(Depth.Main - 2)
    );

    const cam = camera(this);

    this.cameras.main.setBounds(
      map.getArea('Camera Bounds').x,
      map.getArea('Camera Bounds').y,
      map.getArea('Camera Bounds').width,
      map.getArea('Camera Bounds').height
    );

    const gateway = checkFlag(Flag.AutumnSnowmanCompleted)
      ? createGateway(
          this,
          map.getArea('Ice Cube Area Gateway'),
          player,
          cam,
          Phaser.Math.Vector2.UP,
          Scene.AutumnIceCubeWithSnowman,
          Scene.AutumnSnowman
        )
      : createGateway(
          this,
          map.getArea('Ice Cube Area Gateway'),
          player,
          cam,
          Phaser.Math.Vector2.UP,
          Scene.AutumnIceCube,
          Scene.AutumnSnowman
        );

    collisionBorder(this, map.getArea('Push Area')).forEach((c) => c.mask(CollisionMask.Pushable));

    const snowman = createSnowman(this, player, map, ySort, () => this.isSnowmanDialogActive);

    const count = [
      checkFlag(Flag.AutumnSnowmanSnow1Completed),
      checkFlag(Flag.AutumnSnowmanSnow2Completed),
      checkFlag(Flag.AutumnSnowmanSnow3Completed),
    ].filter((o) => !!o).length;

    snowman.animationForCount(count);

    const particles = this.add
      .particles(snowman.x, snowman.y - 6, Sprite.White1px, {
        active: false,
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Circle(0, 0, 32) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
        },
        angle: { min: -360, max: 360 },
        quantity: 2,
        lifespan: 400,
        frequency: 10,
        speed: 2,
      })
      .setDepth(Depth.Main + 1);

    particles.createGravityWell({
      x: 0,
      y: 0,
      power: 1,
      epsilon: 100,
      gravity: 20,
    });

    const particles2 = this.add
      .particles(snowman.x, snowman.y - 6, Sprite.White1px, {
        lifespan: 500,
        speed: { min: 60, max: 120 },
        angle: { min: 180 + 45, max: 360 - 45 },
        gravityY: 300,
        frequency: -1,
        quantity: 50,
      })
      .setDepth(Depth.Main + 1);

    const resolveSnowmanCutscene = (flag: TypeOfFlag, snow: Phaser.GameObjects.Container): Sequence => {
      const count = [
        checkFlag(Flag.AutumnSnowmanSnow1Completed),
        checkFlag(Flag.AutumnSnowmanSnow2Completed),
        checkFlag(Flag.AutumnSnowmanSnow3Completed),
      ].filter((o) => !!o).length;

      if (count === 2) {
        return sequence(this)
          .of([
            runCallback(() => {
              this.isSnowmanDialogActive = false;
              setFlag(flag);
              setFlag(Flag.AutumnSnowmanCompleted);
              player.disableUserInput();
              ui(this).showLetterbox();
              cam.zoom(2, 1000);
              cam.pauseFollow();
              cam.move(map.getPoint('Snowman'), 2000);
            }),
            wait(1800),
            new RunCallback(() => {
              particles.start().resume();
            }),
            new Wait(2000),
            new RunCallback(() => {
              snowman.animationForCount(count + 1);
              cam.shake();
              this.sound.play(Sound.Explosion, { volume: 0.6 });
              particles.stop();
              particles2.explode();
            }),
            runCallback(() => snow.destroy()),
            new Wait(600),
            runCallback(() => snow.destroy()),
            new PlayDialog(DialogBox.get(this), this.resolveSnowmanDialog(count)),
            wait(400),
            new MoveToTarget(player.movement, map.getPoint('Player During Snowman Build')),
            runCallback(() => player.movement.faceDirection(Phaser.Math.Vector2.DOWN)),
            new PlayDialog(DialogBox.get(this), completeSnowman),
            wait(400),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 1')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 2')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 3')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 4')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 5')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 6')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 7')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 8')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 9')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 10')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 11')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 12')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 13')),
            new MoveToTarget(snowman.movement, map.getPoint('Snowman Path 14')),
            wait(400),
            runCallback(() => {
              ui(this).hideLetterbox();
              cam.zoom(1, 800);
              cam.resumeFollow();
              gateway.destroy();
              snowman.destroy();
              this.isSnowmanDialogActive = true;
              createGateway(
                this,
                map.getArea('Ice Cube Area Gateway'),
                player,
                cam,
                Phaser.Math.Vector2.UP,
                Scene.AutumnIceCubeWithSnowman,
                Scene.AutumnSnowman
              );
            }),
            wait(600),
            runCallback(() => {
              player.enableUserInput();
            }),
          ])
          .destroyWhenComplete();
      }

      return sequence(this)
        .of([
          runCallback(() => {
            setFlag(flag);
            this.isSnowmanDialogActive = false;
            player.disableUserInput();
            ui(this).showLetterbox();
            cam.zoom(2, 1000);
            cam.pauseFollow();
            cam.move(map.getPoint('Snowman'), 2000);
          }),
          wait(1800),
          new RunCallback(() => {
            particles.start().resume();
          }),
          new Wait(2000),
          new RunCallback(() => {
            snowman.animationForCount(count + 1);
            cam.shake();
            this.sound.play(Sound.Explosion, { volume: 0.6 });
            particles.stop();
            particles2.explode();
          }),
          runCallback(() => snow.destroy()),
          new Wait(600),
          new PlayDialog(DialogBox.get(this), this.resolveSnowmanDialog(count)),
          wait(400),
          runCallback(() => {
            ui(this).hideLetterbox();
            cam.zoom(1, 800);
            cam.resumeFollow();
          }),
          wait(600),
          runCallback(() => {
            this.isSnowmanDialogActive = true;
            player.enableUserInput();
          }),
        ])
        .destroyWhenComplete();
    };

    if (!checkFlag(Flag.AutumnSnowmanSnow1Completed)) {
      const snow1 = createSnow1(this, player, map, ySort, () => {
        resolveSnowmanCutscene(Flag.AutumnSnowmanSnow1Completed, snow1).start();
      });
    }

    if (!checkFlag(Flag.AutumnSnowmanSnow2Completed)) {
      const snow2 = createSnow2(this, player, map, ySort, () => {
        resolveSnowmanCutscene(Flag.AutumnSnowmanSnow2Completed, snow2).start();
      });
    }

    if (!checkFlag(Flag.AutumnSnowmanSnow3Completed)) {
      const snow3 = createSnow3(this, player, map, ySort, () => {
        resolveSnowmanCutscene(Flag.AutumnSnowmanSnow3Completed, snow3).start();
      });
    }

    if (count === 3) {
      snowman.destroy();
    }

    cam.follow(player);
  }

  private resolveSnowmanDialog(count: number): Dialog {
    if (count === 0) {
      return snowmanWithOneSnow;
    }

    if (count === 1) {
      return snowmanWithTwoSnow;
    }

    return snowmanWithThreeSnow;
  }
}
