import { DialogBox as DialogBoxObject } from 'common/objects/dialog_box';
import { Scene, Shader } from 'constants';
import { ui, UserInterface } from 'systems/ui';

export class DialogBox extends Phaser.Scene {
  private ui: UserInterface;

  public dialogBox: DialogBoxObject;

  public container: Phaser.GameObjects.Container;

  private isLetterboxShown = false;

  constructor() {
    super(Scene.DialogBox);
  }

  create() {
    this.ui = ui(this);

    this.dialogBox = new DialogBoxObject(this);

    this.container = this.add.container();

    this.container.add([this.dialogBox, this.dialogBox.sprite]);
    this.container.sort('depth');

    this.cameras.main.setPostPipeline(Shader.Noise);
  }

  public static get(scene: Phaser.Scene): DialogBoxObject {
    return scene.scene.get<DialogBox>(Scene.DialogBox).dialogBox;
  }

  update() {
    this.scene.moveAbove(ui(this).toScene());
    this.scene.moveBelow(ui(this).toScene());

    if (this.ui.isLetterboxShown() && !this.isLetterboxShown) {
      this.tweens.add({
        targets: this.container,
        y: this.renderer.height / -6,
        ease: 'Cubic',
        duration: 800,
      });

      this.isLetterboxShown = true;
    }

    if (this.ui.isLetterboxHidden() && this.isLetterboxShown) {
      this.tweens.add({
        targets: this.container,
        y: 0,
        ease: 'Cubic',
        duration: 800,
      });

      this.isLetterboxShown = false;
    }
  }
}
