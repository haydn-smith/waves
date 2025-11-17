import { iceCubeIntro } from 'common/conversations/summer';
import { createGateway } from 'common/factories/gateways';
import {
  createFan1,
  createFan2,
  createFan3,
  createIceCube,
  createIceWall,
  createSnowCaveIn,
} from 'common/factories/summer_ice_cube';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { PlayDialog } from 'common/sequenceables/play_dialog';
import { logEvent } from 'common/utils/log';
import { Depth, Flag, Scene, Sprite, Tilemap } from 'constants';
import { camera } from 'systems/camera';
import { checkFlag, setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';
import { DialogBox } from './dialog_box';

export class SummerIceCube extends Phaser.Scene {
  constructor() {
    super(Scene.SummerIceCube);
  }

  create() {
    logEvent('Creating "Summer Ice Cube" scene.');

    const userInterface = ui(this);

    const ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.SummerIceCube);

    const player = new Player(this).addToDisplayList().addToUpdateList();

    const cam = camera(this);

    ySortObjects.add(player);

    map.forPoints('Snow 1', (v) =>
      ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow1).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 2', (v) =>
      ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow2).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 3', (v) =>
      ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow3).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 4', (v) =>
      ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow4).setPosition(v.x, v.y)))
    );

    const introCutscene = sequence(this).of([
      runCallback(() => {
        setFlag(Flag.SummerIceCubeIntroWatched);
        player.disableUserInput();
        userInterface.showLetterbox();
        cam.zoom(2, 1000);
        cam.pauseFollow();
        cam.move(map.getPoint('Ice Cube'), 2000);
      }),
      wait(2000),
      new PlayDialog(DialogBox.get(this), iceCubeIntro),
      wait(500),
      runCallback(() => {
        userInterface.showLetterbox();
        cam.zoom(1, 1000);
        cam.resumeFollow();
      }),
      wait(1000),
      runCallback(() => {
        player.enableUserInput();
      }),
    ]);

    const iceCube = createIceCube(this, player, map, ySortObjects);

    const iceWall = createIceWall(this, player, map, ySortObjects);

    createFan1(this, player, map, ySortObjects, cam);

    createFan2(this, player, map, ySortObjects, cam);

    createFan3(this, player, map, ySortObjects, cam, iceCube, iceWall);

    // createSnowBarrier();

    createGateway(
      this,
      map.getArea('Jetty Area Gateway'),
      player,
      cam,
      Phaser.Math.Vector2.LEFT,
      Scene.SummerJetty,
      Scene.SummerIceCube,
      () => {
        if (!checkFlag(Flag.SummerIceCubeIntroWatched)) introCutscene.destroyWhenComplete().start();
      }
    );

    createGateway(
      this,
      map.getArea('Flower Area Gateway'),
      player,
      cam,
      Phaser.Math.Vector2.RIGHT,
      Scene.SummerFlower,
      Scene.SummerIceCube
    );

    cam.follow(player);

    createSnowCaveIn(this, map, player);
  }
}
