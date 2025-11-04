import { actionInput } from 'common/factories/input';
import { debugMap } from 'common/factories/tilemap';
import { Player } from 'common/objects/player';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Sprite } from 'constants';
import { Audio, SpatialAudio } from 'systems/audio';
import { camera, Camera } from 'systems/camera';
import { Input } from 'systems/input';
import { ui, UserInterface } from 'systems/ui';

export class Debug extends Phaser.Scene {
  private ui: UserInterface;

  private player: Phaser.GameObjects.Container;

  private inputs: Input;

  private camera: Camera;

  private activate: Audio;

  private music: SpatialAudio;

  private ySortObjects: YSortObjects;

  constructor() {
    super(Scene.Debug);
  }

  create() {
    logEvent('Creating "Debug" scene.');

    this.ui = ui(this).fadeIn(1000);

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = debugMap(this);

    map.forPoints('Snow 1', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow1)));
    map.forPoints('Snow 2', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow2)));
    map.forPoints('Snow 3', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow3)));
    map.forPoints('Snow 4', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow4)));

    map.forPoints('Jetty', (v) => this.add.sprite(v.x, v.y, Sprite.Jetty).setDepth(Depth.Main - 1));

    map.forPoints('Main Plant', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.MainPlant)));

    map.forPoints('Dead Plant 1', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.DeadPlant1)));
    map.forPoints('Dead Plant 2', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.DeadPlant2)));
    map.forPoints('Dead Plant 3', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.DeadPlant3)));

    this.player = new Player(this)
      .setDepth(Depth.Main)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y)
      .addToDisplayList()
      .addToUpdateList();

    this.ySortObjects.add(this.player);

    this.inputs = actionInput(this);

    this.camera = camera(this).follow(this.player).zoom(1);
  }

  update() {}
}
