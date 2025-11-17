import { createGateway } from 'common/factories/gateways';
import { createMeltedSnow1, createMeltedSnow2 } from 'common/factories/summer_jetty';
import { Jetty } from 'common/objects/jetty';
import { Player } from 'common/objects/player';
import { Snow } from 'common/objects/snow';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Animation, Depth, Flag, Scene, Sprite, Tilemap } from 'constants';
import { camera } from 'systems/camera';
import { checkFlag, setFlag } from 'systems/flags';
import { playAnimation, runCallback, sequence, wait } from 'systems/sequence';
import { ui } from 'systems/ui';

export class SummerJetty extends Phaser.Scene {
  constructor() {
    super(Scene.SummerJetty);
  }

  create() {
    logEvent('Creating "Summer Jetty" scene.');

    const userInterface = ui(this);

    const ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.SummerJetty);

    const player = new Player(this).addToDisplayList().addToUpdateList();

    const cam = camera(this);

    this.cameras.main.setBounds(
      map.getArea('Camera Bounds').x,
      map.getArea('Camera Bounds').y,
      map.getArea('Camera Bounds').width,
      map.getArea('Camera Bounds').height
    );

    ySortObjects.add(player);

    map.forPoints('Snow 1', (v) =>
      ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow1).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 2', (v) =>
      ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow2).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 3', (v) =>
      ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow3).setPosition(v.x, v.y)))
    );
    map.forPoints('Snow 4', (v) =>
      ySortObjects.add(this.add.existing(new Snow(this, Sprite.Snow4).setPosition(v.x, v.y)))
    );

    const jetty = this.add.existing(new Jetty(this));

    map.forPoints('Jetty', (v) => {
      jetty.setPosition(v.x, v.y);
    });

    if (!checkFlag(Flag.SummerWakeUpCutsceneWatched)) {
      player.setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

      sequence(this)
        .of([
          runCallback(() => setFlag(Flag.SummerWakeUpCutsceneWatched)),
          runCallback(() => player.animator.playAnimation(Animation.PlayerSleep)),
          runCallback(() => player.disableUserInput()),
          runCallback(() => ui(this).showLetterbox()),
          runCallback(() => cam.zoom(2)),
          wait(1000),
          runCallback(() => ui(this).fadeIn(2000)),
          wait(4000),
          playAnimation(player.sprite, Animation.PlayerWakeUp),
          wait(1000),
          runCallback(() => player.animator.playAnimation(Animation.PlayerWave)),
          wait(2000),
          runCallback(() => player.animator.playMovementAndIdleAnimations()),
          wait(1000),
          runCallback(() => cam.zoom(1, 800)),
          runCallback(() => ui(this).hideLetterbox()),
          wait(800),
          runCallback(() => player.enableUserInput()),
        ])
        .destroyWhenComplete()
        .start();
    }

    createGateway(
      this,
      map.getArea('Ice Cube Area Trigger'),
      player,
      cam,
      Phaser.Math.Vector2.RIGHT,
      Scene.SummerIceCube,
      Scene.SummerJetty
    );

    cam.follow(player);

    createMeltedSnow1(this, player, map);

    createMeltedSnow2(this, player, map);
  }
}
