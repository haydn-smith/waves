import { createGateway } from 'common/factories/gateways';
import { createMeltedSnow1, createMeltedSnow2 } from 'common/factories/summer_jetty';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { MoveToTarget } from 'common/sequenceables/move_to_target';
import { logEvent } from 'common/utils/log';
import { Depth, Flag, Scene, Shader, Sprite, Tilemap } from 'constants';
import { camera } from 'systems/camera';
import { checkFlag, setFlag } from 'systems/flags';
import { runCallback, sequence, wait } from 'systems/sequence';
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

    ySortObjects.add(player);

    map.forPoints('Jetty', (v) => this.add.sprite(v.x, v.y, Sprite.Jetty).setDepth(Depth.Main - 1));

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

    if (!checkFlag(Flag.SummerWakeUpCutsceneWatched)) {
      player.setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

      sequence(this)
        .of([
          runCallback(() => setFlag(Flag.SummerWakeUpCutsceneWatched)),
          runCallback(() => player.sleep()),
          runCallback(() => player.disableUserInput()),
          runCallback(() => userInterface.showLetterbox()),
          runCallback(() => cam.zoom(2)),
          wait(500),
          runCallback(() => userInterface.fadeIn(2000)),
          wait(3000),
          runCallback(() => player.wave()),
          wait(1000),
          runCallback(() => player.runnningAround()),
          wait(500),
          new MoveToTarget(player.movement, map.getPoint('Player Move to Start')),
          runCallback(() => cam.zoom(1, 800)),
          runCallback(() => userInterface.hideLetterbox()),
          wait(800),
          runCallback(() => player.runnningAround()),
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
