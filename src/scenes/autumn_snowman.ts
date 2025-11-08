import { createSnow1, createSnowman } from 'common/factories/autumn_snowman';
import { createGateway } from 'common/factories/gateways';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { CollisionMask, Depth, Scene, Tilemap } from 'constants';
import { camera } from 'systems/camera';
import { collisionBorder } from 'systems/collision';

export class AutumnSnowman extends Phaser.Scene {
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

    const snowman = createSnowman(this, player, map, ySort);

    const snow1 = createSnow1(this, player, map, ySort);

    cam.follow(player);
  }
}
