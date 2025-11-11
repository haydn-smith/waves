import { createGateway } from 'common/factories/gateways';
import { createIceCube, createSnowman, createStorm } from 'common/factories/winter_ice_cube';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Shader, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';

export class WinterIceCube extends Phaser.Scene {
  private player: Player;

  private camera: Camera;

  private ySortObjects: YSortObjects;

  constructor() {
    super(Scene.WinterIceCube);
  }

  create() {
    logEvent('Creating "Winter Ice Cube" scene.');

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.WinterIceCube);

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

    this.camera = camera(this).follow(this.player).zoom(1).shake(2, 0, -1, 200);

    createGateway(
      this,
      map.getArea('Flower Area Gateway'),
      this.player,
      this.camera,
      Phaser.Math.Vector2.RIGHT,
      Scene.AutumnFlower,
      Scene.WinterIceCube
    );

    ui(this).black();
    sequence(this)
      .of([
        runCallback(() => this.player.setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y)),
        runCallback(() => this.camera.follow(this.player)),
        runCallback(() => this.player.disableUserInput()),
        runCallback(() => {
          this.camera.zoom(2);

          sequence(this)
            .of([wait(500), runCallback(() => ui(this).fadeIn(500))])
            .destroyWhenComplete()
            .start();
        }),
        new MoveToTarget(this.player.movement.setSpeed(16), map.getPoint('Player Move To')),
        wait(2000),
        runCallback(() => {
          this.camera.zoom(1, 1000);
          this.player.enableUserInput();
          this.player.movement.setSpeed(32);
        }),
      ])
      .destroyWhenComplete()
      .start();

    createSnowman(this, this.player, map, this.ySortObjects);

    createIceCube(this, this.player, map, this.ySortObjects);

    createStorm(this, this.player, map, this.camera);
  }

  update() {}
}
