import { Snow } from 'common/objects/snow';
import { Storm } from 'common/objects/storm';
import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Animation, Depth, Scene, Sprite, Tilemap } from 'constants';
import { camera, Camera } from 'systems/camera';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class SpringAgainFlower extends Phaser.Scene {
  private ui: UserInterface;

  private camera: Camera;

  private ySortObjects: YSortObjects;

  constructor() {
    super(Scene.SpringAgainFlower);
  }

  create() {
    logEvent('Creating "Spring Again Flower" scene.');

    this.ui = ui(this);

    this.ySortObjects = this.add.existing(new YSortObjects(this)).setDepth(Depth.Main);

    const map = new TilemapObject(this, Tilemap.SpringAgainFlower);

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

    this.add.existing(new Storm(this));

    this.camera = camera(this).zoom(1).move(map.getPoint('Dead Flower 1'), 0);

    createFlower(this, map, this.ySortObjects);

    sequence(this)
      .of([
        runCallback(() => {
          ui(this).black().showLetterbox();
        }),
        wait(800),
        runCallback(() => this.camera.zoom(2)),
        runCallback(() => {
          this.camera.move(map.getPoint('Flower'), 9000, Phaser.Math.Easing.Cubic.Out);
        }),
        runCallback(() => {
          ui(this).fadeIn(1000);
        }),
        wait(12000),
        runCallback(() => {
          ui(this).fadeOut(2000);
        }),
        wait(2000),
        runCallback(() => this.scene.start(Scene.Finish)),
      ])
      .start();
  }

  update() {}
}

const createFlower = (scene: Phaser.Scene, map: TilemapObject, ySortObjects: YSortObjects) => {
  const position = map.getPoint('Flower');

  const sprite = scene.add.sprite(position.x, position.y, Sprite.MainPlant);

  sprite.anims.play(Animation.MainPlantWithFlower);

  ySortObjects.add(sprite);
};
