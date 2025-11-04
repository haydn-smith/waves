import { actionInput } from 'common/factories/input';
import { createOtherPenguinCutscene } from 'common/factories/spring_jetty';
import { DialogBox } from 'common/objects/dialog_box';
import { OtherPenguin } from 'common/objects/other_penguin';
import { Player } from 'common/objects/player';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Sprite, Tilemap } from 'constants';
import { Audio, SpatialAudio } from 'systems/audio';
import { camera, Camera } from 'systems/camera';
import { collision } from 'systems/collision';
import { Input } from 'systems/input';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class SpringJetty extends Phaser.Scene {
  private ui: UserInterface;

  private player: Player;

  private otherPenguin: OtherPenguin;

  private inputs: Input;

  private camera: Camera;

  private activate: Audio;

  private music: SpatialAudio;

  private ySortObjects: YSortObjects;

  constructor() {
    super(Scene.SpringJetty);
  }

  create() {
    logEvent('Creating "Spring Jetty" scene.');

    this.ui = ui(this);

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.SpringJetty);

    map.forPoints('Snow 1', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow1)));
    map.forPoints('Snow 2', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow2)));
    map.forPoints('Snow 3', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow3)));
    map.forPoints('Snow 4', (v) => this.ySortObjects.add(this.add.sprite(v.x, v.y, Sprite.Snow4)));

    map.forPoints('Jetty', (v) => this.add.sprite(v.x, v.y, Sprite.Jetty).setDepth(Depth.Main - 1));

    map.forAreas('Block Player From Exit', (r) => collision(this, r));

    this.player = new Player(this)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y)
      .addToDisplayList()
      .addToUpdateList();

    this.otherPenguin = new OtherPenguin(this)
      .setPosition(map.getPoint('Other Penguin').x, map.getPoint('Other Penguin').y)
      .addToUpdateList()
      .addToDisplayList();

    this.ySortObjects.add(this.player);
    this.ySortObjects.add(this.otherPenguin);

    this.inputs = actionInput(this);

    this.camera = camera(this).follow(this.player).zoom(1);

    const dialogBox = this.add.existing(new DialogBox(this)).setDepth(Depth.UI + 1);

    dialogBox
      .setDialog([
        {
          image: Sprite.PlayerSleep,
          line1: ['Hello... ', '...this... '],
          line2: ['...is cool!'],
        },
        {
          image: Sprite.MainPlant,
          line1: ['...', '...hell... '],
          line2: ['...yea it is!'],
        },
      ])
      .play();

    createOtherPenguinCutscene(this, this.player, this.otherPenguin, this.camera, map);

    sequence(this)
      .of([
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
      .destroyWhenComplete();
    // .start();
  }

  update() {}
}
