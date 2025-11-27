import { iceCubeIntro } from 'common/conversations/summer';
import { createGateway } from 'common/factories/gateways';
import { vec2 } from 'common/factories/phaser';
import {
  createFan1,
  createFan1On,
  createFan2,
  createFan2On,
  createIceCube,
  createIceCubeAfterPuzzle,
  createIceWall,
  createIceWallAfterPuzzle,
  createSnowCaveIn,
  createWindyArea,
} from 'common/factories/summer_ice_cube';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Storm } from 'common/objects/storm';
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

    this.add.existing(new Storm(this));

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
    map.forPoints('Puddle 1', (v) => this.add.sprite(v.x, v.y, Sprite.Puddle1).setDepth(Depth.Main - 1));
    map.forPoints('Puddle 2', (v) => this.add.sprite(v.x, v.y, Sprite.Puddle2).setDepth(Depth.Main - 1));

    const introCutscene = sequence(this).of([
      runCallback(() => {
        setFlag(Flag.SummerIceCubeIntroWatched);
        player.disableUserInput();
        userInterface.showLetterbox();
        cam.zoom(2, 1000);
        cam.pauseFollow();
        cam.move(vec2(map.getPoint('Ice Cube').x, map.getPoint('Ice Cube').y + 16), 2000);
      }),
      wait(1800),
      new PlayDialog(DialogBox.get(this), iceCubeIntro),
      wait(500),
      runCallback(() => {
        userInterface.hideLetterbox();
        cam.zoom(1, 800);
        cam.resumeFollow();
      }),
      wait(600),
      runCallback(() => {
        player.enableUserInput();
      }),
    ]);

    const iceCube = createIceCube(this, player, map, ySortObjects);

    const iceWall = createIceWall(this, player, map, ySortObjects);

    const fan1 = createFan1(this, player, map, ySortObjects, cam, iceCube, iceWall);

    const fan2 = createFan2(this, player, map, ySortObjects, cam, iceCube, iceWall);

    this.cameras.main.setBounds(
      map.getArea('Camera Bounds').x,
      map.getArea('Camera Bounds').y,
      map.getArea('Camera Bounds').width,
      map.getArea('Camera Bounds').height
    );

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

    if (checkFlag(Flag.SummerIceCubeFan1Activated) && checkFlag(Flag.SummerIceCubeFan2Activated)) {
      iceWall.destroy();
      iceCube.destroy();
      createIceWallAfterPuzzle(this, player, map, ySortObjects);
      createIceCubeAfterPuzzle(this, player, map, ySortObjects);
      createWindyArea(this, player, map);
    }

    if (checkFlag(Flag.SummerIceCubeFan1Activated)) {
      fan1.destroy();
      createFan1On(this, map, ySortObjects);
    }

    if (checkFlag(Flag.SummerIceCubeFan2Activated)) {
      fan2.destroy();
      createFan2On(this, map, ySortObjects);
    }
  }
}
