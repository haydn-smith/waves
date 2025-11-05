import { createGateway } from 'common/factories/gateways';
import { createOtherPenguinCutscene } from 'common/factories/spring_jetty';
import { OtherPenguin } from 'common/objects/other_penguin';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Flag, Scene, Shader, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { checkFlag, setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class SpringJetty extends Phaser.Scene {
  private ui: UserInterface;

  private player: Player;

  private otherPenguin: OtherPenguin;

  private camera: Camera;

  private ySortObjects: YSortObjects;

  constructor() {
    super(Scene.SpringJetty);
  }

  create() {
    logEvent('Creating "Spring Jetty" scene.');

    this.ui = ui(this);

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.SpringJetty);

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

    this.player = new Player(this).addToDisplayList().addToUpdateList();

    this.ySortObjects.add(this.player);

    this.camera = camera(this);

    createGateway(
      this,
      map.getArea('Ice Cube Area Trigger'),
      this.player,
      this.camera,
      Phaser.Math.Vector2.RIGHT,
      Scene.SpringIceCube,
      Scene.SpringJetty
    );

    if (!checkFlag(Flag.OtherPenguinCutsceneWatched)) {
      this.otherPenguin = new OtherPenguin(this)
        .setPosition(map.getPoint('Other Penguin').x, map.getPoint('Other Penguin').y)
        .addToUpdateList()
        .addToDisplayList();

      this.ySortObjects.add(this.otherPenguin);

      const blockPlayerFromExit = collision(this, map.getArea('Block Player From Exit'));

      createOtherPenguinCutscene(this, this.player, this.otherPenguin, this.camera, map, blockPlayerFromExit);
    }

    if (!checkFlag(Flag.OpeningCutsceneWatched)) {
      this.player.setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

      sequence(this)
        .of([
          runCallback(() => setFlag(Flag.OpeningCutsceneWatched)),
          runCallback(() => this.player.sleep()),
          runCallback(() => this.player.disableUserInput()),
          runCallback(() => this.ui.showLetterbox()),
          runCallback(() => this.camera.zoom(2)),
          wait(500),
          runCallback(() => this.ui.fadeIn(2000)),
          wait(3000),
          runCallback(() => this.player.wave()),
          wait(1000),
          runCallback(() => this.camera.zoom(1, 800)),
          runCallback(() => this.ui.hideLetterbox()),
          wait(800),
          runCallback(() => this.player.runnningAround()),
          runCallback(() => this.player.enableUserInput()),
        ])
        .destroyWhenComplete()
        .start();
    }

    this.camera.follow(this.player).zoom(1);
  }

  update() {}
}
