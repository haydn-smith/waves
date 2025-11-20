import {
  createIceCube,
  createSnowBarrierLiftCutscene,
  createSnowmanAfterCutscene,
} from 'common/factories/autumn_ice_cube_with_snowman';
import { createGateway } from 'common/factories/gateways';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Storm } from 'common/objects/storm';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Flag, Scene, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { checkFlag } from 'systems/flags';

export class AutumnIceCubeWithSnowman extends Phaser.Scene {
  private player: Player;

  private camera: Camera;

  constructor() {
    super(Scene.AutumnIceCubeWithSnowman);
  }

  create() {
    logEvent('Creating "Autumn Ice Cube With Snowman" scene.');
    this.add.existing(new Storm(this));

    const ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.AutumnIceCubeWithSnowman);

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

    this.player = new Player(this)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y)
      .addToDisplayList()
      .addToUpdateList();

    ySortObjects.add(this.player);

    this.camera = camera(this).follow(this.player).zoom(1);

    this.cameras.main.setBounds(
      map.getArea('Camera Bounds').x,
      map.getArea('Camera Bounds').y,
      map.getArea('Camera Bounds').width,
      map.getArea('Camera Bounds').height
    );

    createGateway(
      this,
      map.getArea('Jetty Area Gateway'),
      this.player,
      this.camera,
      Phaser.Math.Vector2.LEFT,
      Scene.AutumnJetty,
      Scene.AutumnIceCubeWithSnowman
    );

    createGateway(
      this,
      map.getArea('Flower Area Gateway'),
      this.player,
      this.camera,
      Phaser.Math.Vector2.RIGHT,
      Scene.AutumnFlower,
      Scene.AutumnIceCubeWithSnowman
    );

    createGateway(
      this,
      map.getArea('Snowman Area Gateway'),
      this.player,
      this.camera,
      Phaser.Math.Vector2.DOWN,
      Scene.AutumnSnowman,
      Scene.AutumnIceCubeWithSnowman
    );

    createIceCube(this, this.player, map, ySortObjects);

    if (!checkFlag(Flag.AutumnSnowBarrierLiftCutsceneWatched)) {
      createSnowBarrierLiftCutscene(this, this.player, map, ySortObjects, this.camera);
    } else {
      createSnowmanAfterCutscene(this, this.player, map, ySortObjects);
    }
  }

  update() {}
}
