import { createIceCube, createSnowBarrier } from 'common/factories/autumn_ice_cube';
import { createGateway } from 'common/factories/gateways';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Storm } from 'common/objects/storm';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { ui, UserInterface } from 'systems/ui';

export class AutumnIceCube extends Phaser.Scene {
  private ui: UserInterface;

  private player: Player;

  private camera: Camera;

  private ySortObjects: YSortObjects;

  constructor() {
    super(Scene.AutumnIceCube);
  }

  create() {
    logEvent('Creating "Autumn Ice Cube" scene.');
    this.add.existing(new Storm(this));

    this.ui = ui(this);

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.AutumnIceCube);

    map.forPoints('Snow 1', (v) =>
      this.ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow1).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 2', (v) =>
      this.ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow2).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 3', (v) =>
      this.ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow3).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 4', (v) =>
      this.ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow4).setPosition(v.x, v.y)))
    );

    this.player = new Player(this)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y)
      .addToDisplayList()
      .addToUpdateList();

    this.ySortObjects.add(this.player);

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
      Scene.AutumnIceCube
    );

    createGateway(
      this,
      map.getArea('Flower Area Gateway'),
      this.player,
      this.camera,
      Phaser.Math.Vector2.RIGHT,
      Scene.AutumnFlower,
      Scene.AutumnIceCube
    );

    createGateway(
      this,
      map.getArea('Snowman Area Gateway'),
      this.player,
      this.camera,
      Phaser.Math.Vector2.DOWN,
      Scene.AutumnSnowman,
      Scene.AutumnIceCube
    );

    createIceCube(this, this.player, map, this.ySortObjects);

    createSnowBarrier(this, this.player, map);
  }

  update() {}
}
