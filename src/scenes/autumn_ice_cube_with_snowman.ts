import { createIceCube } from 'common/factories/autumn_ice_cube_with_snowman';
import { createGateway } from 'common/factories/gateways';
import { Player } from 'common/objects/player';
import { Snowman } from 'common/objects/snowman';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Shader, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';

export class AutumnIceCubeWithSnowman extends Phaser.Scene {
  private player: Player;

  private camera: Camera;

  constructor() {
    super(Scene.AutumnIceCubeWithSnowman);
  }

  create() {
    logEvent('Creating "Autumn Ice Cube With Snowman" scene.');

    const ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.AutumnIceCubeWithSnowman);

    map.forPoints('Snow 1', (v) =>
      ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow1).setPipeline(Shader.Outline))
    );
    map.forPoints('Snow 2', (v) =>
      ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow2).setPipeline(Shader.Outline))
    );
    map.forPoints('Snow 3', (v) =>
      ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow3).setPipeline(Shader.Outline))
    );
    map.forPoints('Snow 4', (v) =>
      ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow4).setPipeline(Shader.Outline))
    );

    this.player = new Player(this)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y)
      .addToDisplayList()
      .addToUpdateList();

    ySortObjects.add(this.player);

    this.camera = camera(this).follow(this.player).zoom(1);

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

    ySortObjects.add(new Snowman(this).setPosition(map.getPoint('Snowman Start').x, map.getPoint('Snowman Start').y));
  }

  update() {}
}
