import {
  createFinalCutscene,
  createIceCube2,
  createSnowBarrier,
  createSnowman2,
} from 'common/factories/spring_again_jetty';
import { Jetty } from 'common/objects/jetty';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Storm } from 'common/objects/storm';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { logEvent } from 'common/utils/log';
import { Animation, Depth, Scene, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class SpringAgainJetty extends Phaser.Scene {
  private ui: UserInterface;

  private player: Player;

  private camera: Camera;

  private ySortObjects: YSortObjects;

  constructor() {
    super(Scene.SpringAgainJetty);
  }

  create() {
    logEvent('Creating "Spring Again Jetty" scene.');

    this.ui = ui(this).black();

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.SpringAgainJetty);

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

    const jetty = this.add.existing(new Jetty(this));

    map.forPoints('Jetty', (v) => {
      jetty.setPosition(v.x, v.y);
    });

    this.player = new Player(this)
      .addToDisplayList()
      .addToUpdateList()
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

    this.ySortObjects.add(this.player);

    this.camera = camera(this);

    this.cameras.main.setBounds(
      map.getArea('Camera Bounds').x,
      map.getArea('Camera Bounds').y,
      map.getArea('Camera Bounds').width,
      map.getArea('Camera Bounds').height
    );

    this.camera.follow(this.player);

    sequence(this)
      .of([
        runCallback(() => {
          this.player.disableUserInput();
          this.player.movement.faceDirection(Phaser.Math.Vector2.LEFT);
          this.ui.showLetterbox();
          this.camera.zoom(2);
        }),
        wait(800),
        runCallback(() => {
          this.ui.fadeIn();
          this.player.movement.setSpeed(8);
        }),
        wait(2000),
        new MoveToTarget(this.player.movement, map.getPoint('Player Move To Opening')),
        runCallback(() => this.player.movement.faceDirection(Phaser.Math.Vector2.LEFT)),
        wait(1000),
        runCallback(() => {
          this.player.animator.playAnimationOnce(Animation.PlayerSigh, true);
        }),
        wait(3000),
        runCallback(() => {
          this.player.movement.setSpeed(40);
          this.player.enableUserInput();
          this.ui.hideLetterbox();
          this.camera.zoom(1, 1000);
        }),
      ])
      .start()
      .destroyWhenComplete();

    const snowman = createSnowman2(this, this.player, map, this.camera);

    const iceCube = createIceCube2(this, this.player, map, this.camera);

    this.add.existing(new Storm(this));

    this.ySortObjects.add(snowman);

    createSnowBarrier(this, this.player, map);

    createFinalCutscene(this, map, this.camera, this.player, snowman, iceCube, jetty);

    this.ySortObjects.add(snowman);
    this.ySortObjects.add(iceCube);
  }

  update() {}
}
