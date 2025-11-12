import { createIceCube, createSnowBarrier, createSnowman } from 'common/factories/spring_again_jetty';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Shader, Sprite, Tilemap } from 'constants';
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

    map.forPoints('Jetty', (v) => this.add.sprite(v.x, v.y, Sprite.Jetty).setDepth(Depth.Main - 1));

    this.player = new Player(this)
      .addToDisplayList()
      .addToUpdateList()
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').x);

    this.ySortObjects.add(this.player);

    this.camera = camera(this);

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
        }),
        wait(800),
        // TODO: Get up animation.
        // TODO: sigh animation
        wait(1000),
        runCallback(() => {
          this.player.movement.faceDirection(Phaser.Math.Vector2.RIGHT);
        }),
        wait(500),
        runCallback(() => {
          this.player.enableUserInput();
          this.ui.hideLetterbox();
          this.camera.zoom(1, 1000);
        }),
      ])
      .start()
      .destroyWhenComplete();

    const snowman = createSnowman(this, this.player, map, this.camera);

    const iceCube = createIceCube(this, this.player, map, this.camera);

    createSnowBarrier(this, this.player, map);

    this.ySortObjects.add(snowman);
    this.ySortObjects.add(iceCube);
  }

  update() {}
}
