import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { YSortObjects } from 'common/objects/y_sort_objects';
import { logEvent } from 'common/utils/log';
import { Depth, Scene, Shader, Sprite, Tilemap } from 'constants';
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

    this.camera = camera(this).zoom(1).move(map.getPoint('Dead Flower 1'), 0);

    createFlower(this, map, this.ySortObjects);

    sequence(this)
      .of([
        runCallback(() => ui(this).showLetterbox()),
        runCallback(() => this.camera.zoom(2)),
        runCallback(() => {
          this.camera.move(map.getPoint('Flower'), 6000, Phaser.Math.Easing.Cubic.InOut);
        }),
        wait(800),
        runCallback(() => {
          ui(this).fadeIn(800);
        }),
        wait(7000),
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

  ySortObjects.add(sprite);
};
