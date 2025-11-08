import { createFallLeaves1, createFallLeaves2 } from 'common/factories/autumn_jetty';
import { createGateway } from 'common/factories/gateways';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Flag, Scene, Shader, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { checkFlag, setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class AutumnJetty extends Phaser.Scene {
  private ui: UserInterface;

  private player: Player;

  private camera: Camera;

  private ySortObjects: YSortObjects;

  constructor() {
    super(Scene.AutumnJetty);
  }

  create() {
    logEvent('Creating "Autumn Jetty" scene.');

    this.ui = ui(this);

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.AutumnJetty);

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
      Scene.AutumnIceCube,
      Scene.AutumnJetty
    );

    if (!checkFlag(Flag.AutumnWakeUpCutsceneWatched)) {
      this.player.setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

      sequence(this)
        .of([
          runCallback(() => setFlag(Flag.AutumnWakeUpCutsceneWatched)),
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

    createFallLeaves1(this, this.player, map);

    createFallLeaves2(this, this.player, map);
  }

  update() {}
}
