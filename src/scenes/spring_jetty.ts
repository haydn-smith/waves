import { createGateway } from 'common/factories/gateways';
import { createOtherPenguinCutscene } from 'common/factories/spring_jetty';
import { Jetty } from 'common/objects/jetty';
import { OtherPenguin } from 'common/objects/other_penguin';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Animation, Depth, Flag, Scene, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { checkFlag, setFlag } from 'systems/flags';
import { playAnimation, runCallback, sequence, wait } from 'systems/sequence';
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

    this.player = new Player(this).addToDisplayList().addToUpdateList();

    this.ySortObjects.add(this.player);

    this.camera = camera(this);

    this.cameras.main.setBounds(
      map.getArea('Camera Bounds').x,
      map.getArea('Camera Bounds').y,
      map.getArea('Camera Bounds').width,
      map.getArea('Camera Bounds').height
    );

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

      createOtherPenguinCutscene(this, this.player, this.otherPenguin, this.camera, map, blockPlayerFromExit, jetty);
    }

    if (!checkFlag(Flag.OpeningCutsceneWatched)) {
      this.ui.black();

      this.player.setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

      sequence(this)
        .of([
          runCallback(() => setFlag(Flag.OpeningCutsceneWatched)),
          runCallback(() => this.player.animator.playAnimation(Animation.PlayerSleep)),
          runCallback(() => this.player.disableUserInput()),
          runCallback(() => this.ui.showLetterbox()),
          runCallback(() => this.camera.zoom(2)),
          wait(1000),
          runCallback(() => this.ui.fadeIn(2000)),
          wait(4000),
          playAnimation(this.player.sprite, Animation.PlayerWakeUp),
          wait(1000),
          runCallback(() => this.player.animator.playAnimation(Animation.PlayerWave)),
          wait(2000),
          runCallback(() => this.player.animator.playMovementAndIdleAnimations()),
          wait(1000),
          runCallback(() => this.camera.zoom(1, 800)),
          runCallback(() => this.ui.hideLetterbox()),
          wait(800),
          runCallback(() => this.player.enableUserInput()),
        ])
        .destroyWhenComplete()
        .start();
    }

    this.camera.follow(this.player).zoom(1);
  }

  update() {}
}
