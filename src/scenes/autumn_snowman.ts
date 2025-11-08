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
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { logEvent } from 'common/utils/log';
import { CollisionMask, Depth, Flag, Scene, Tilemap, TypeOfFlag } from 'constants';
import { camera } from 'systems/camera';
import { collisionBorder } from 'systems/collision';
import { checkFlag, setFlag } from 'systems/flags';
import { runCallback, Sequence, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';
import { DialogBox } from './dialog_box';

export class AutumnSnowman extends Phaser.Scene {
  private isSnowmanDialogActive: boolean;

  constructor() {
    super(Scene.AutumnSnowman);
  }

  create() {
    logEvent('Creating "Autumn Snowman" scene.');

    const map = new TilemapObject(this, Tilemap.AutumnSnowman);

    const player = new Player(this).addToDisplayList().addToUpdateList();

    const ySort = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    ySort.add(player);

    const cam = camera(this);

    createGateway(
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
              player.disableUserInput();
              ui(this).showLetterbox();
              cam.zoom(2, 1000);
              cam.pauseFollow();
              cam.move(map.getPoint('Snowman'), 2000);
            }),
            wait(2000),
            runCallback(() => snow.destroy()),
            new PlayDialog(DialogBox.get(this), this.resolveSnowmanDialog(count)),
            wait(1000),
            new MoveToTarget(player.movement, map.getPoint('Player During Snowman Build')),
            new PlayDialog(DialogBox.get(this), completeSnowman),
            wait(500),
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
            wait(500),
            runCallback(() => {
              ui(this).showLetterbox();
              cam.zoom(1, 1000);
              cam.resumeFollow();
            }),
            wait(1000),
            runCallback(() => {
              snowman.destroy();
              this.isSnowmanDialogActive = true;
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
          wait(2000),
          // TODO: snowman animation.
          runCallback(() => snow.destroy()),
          new PlayDialog(DialogBox.get(this), this.resolveSnowmanDialog(count)),
          wait(500),
          runCallback(() => {
            ui(this).showLetterbox();
            cam.zoom(1, 1000);
            cam.resumeFollow();
          }),
          wait(1000),
          runCallback(() => {
            this.isSnowmanDialogActive = true;
            player.enableUserInput();
          }),
        ])
        .destroyWhenComplete();
    };

    const snow1 = createSnow1(this, player, map, ySort, () => {
      resolveSnowmanCutscene(Flag.AutumnSnowmanSnow1Completed, snow1).start();
    });

    const snow2 = createSnow2(this, player, map, ySort, () => {
      resolveSnowmanCutscene(Flag.AutumnSnowmanSnow2Completed, snow2).start();
    });

    const snow3 = createSnow3(this, player, map, ySort, () => {
      resolveSnowmanCutscene(Flag.AutumnSnowmanSnow2Completed, snow3).start();
    });

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
