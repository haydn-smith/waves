import { createIceCube, createSnowBarrier } from 'common/factories/autumn_ice_cube';
import { createGateway } from 'common/factories/gateways';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Shader, Sprite, Tilemap } from 'constants';
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

    this.ui = ui(this);

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.AutumnIceCube);

    map.forPoints('Snow 1', (v) =>
      this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow1).setPipeline(Shader.Outline))
    );
    map.forPoints('Snow 2', (v) =>
      this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow2).setPipeline(Shader.Outline))
    );
    map.forPoints('Snow 3', (v) =>
      this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow3).setPipeline(Shader.Outline))
    );
    map.forPoints('Snow 4', (v) =>
      this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow4).setPipeline(Shader.Outline))
    );

    this.player = new Player(this)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y)
      .addToDisplayList()
      .addToUpdateList();

    this.ySortObjects.add(this.player);

    this.camera = camera(this).follow(this.player).zoom(1);

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
