import { createGateway } from 'common/factories/gateways';
import { createIceCube, createJettyAreaBlocked, createSnowman, createStorm } from 'common/factories/winter_ice_cube';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Storm } from 'common/objects/storm';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { logEvent } from 'common/utils/log';
import { Depth, Flag, Scene, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { checkFlag, setFlag } from 'systems/flags';
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

    this.camera = camera(this).follow(this.player).zoom(1).shake(2, 0, -1, 200);

    map.forPoints('Snow Top', (v) => this.add.sprite(v.x, v.y, Sprite.CaveInWinterTop).setDepth(Depth.Main - 1));
    map.forPoints('Snow Bottom', (v) => this.add.sprite(v.x, v.y, Sprite.CaveInWinterBottom).setDepth(Depth.Main - 1));

    map.forAreas('Solid', (v) => this.add.existing(collision(this, v).toGameObject()));

    const storm = this.add.existing(new Storm(this).highIntensity());

    this.cameras.main.setBounds(
      map.getArea('Camera Bounds').x,
      map.getArea('Camera Bounds').y,
      map.getArea('Camera Bounds').width,
      map.getArea('Camera Bounds').height
    );

    createGateway(
      this,
      map.getArea('Flower Area Gateway'),
      this.player,
      this.camera,
      Phaser.Math.Vector2.RIGHT,
      Scene.WinterFlower,
      Scene.WinterIceCube
    );

    if (!checkFlag(Flag.WinterIntroCutsceneWatched)) {
      ui(this).black();
      sequence(this)
        .of([
          runCallback(() => this.player.setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y)),
          runCallback(() => this.camera.follow(this.player)),
          runCallback(() => this.player.disableUserInput()),
          runCallback(() => {
            setFlag(Flag.WinterIntroCutsceneWatched);

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
    }

    createSnowman(this, this.player, map, this.ySortObjects);

    createIceCube(this, this.player, map, this.ySortObjects);

    createStorm(this, this.player, map, this.camera, storm);

    createJettyAreaBlocked(this, this.player, map);
  }

  update() {}
}
