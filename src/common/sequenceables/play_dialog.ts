import { Dialog, DialogBox } from 'common/objects/dialog_box';
import { Sequenceable } from 'systems/sequence/contracts/sequenceable';

export class PlayDialog implements Sequenceable {
  private hasStarted = false;

  constructor(
    private dialogBox: DialogBox,
    private dialog: Dialog
  ) {}

  public update() {
    if (this.hasStarted) return;

    this.dialogBox.setDialog(this.dialog).play();

    this.hasStarted = true;
  }

  public isComplete(): boolean {
    return this.dialogBox.isComplete();
  }

  public reset() {
    this.hasStarted = false;
  }
}
