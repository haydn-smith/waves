import { createGateway } from 'common/factories/gateways';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Shader, Sprite, Tilemap } from 'constants';
import { camera } from 'systems/camera';
import { ui } from 'systems/ui';

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

    createGateway(
      this,
      map.getArea('Jetty Area Gateway'),
      player,
      cam,
      Phaser.Math.Vector2.LEFT,
      Scene.SummerJetty,
      Scene.SummerIceCube
    );

    cam.follow(player);
  }
}
