import { actionInput } from 'common/factories/input';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, Shader, Sprite, TypeOfSprite } from 'constants';
import { Input } from 'systems/input';
import { states, States } from 'systems/states';
import { Typewriter } from './typewriter';

export type Dialog = {
  image: TypeOfSprite;
  line1: string[];
  line2: string[];
}[];

export class DialogBox extends Phaser.GameObjects.Container {
  private dialog: Dialog;

  private currentDialog: number = 0;

  private currentLine: number = 0;

  private currentSection: number = 0;

  private states: States<'idle' | 'animating' | 'next line' | 'writing' | 'waiting', 'idle'>;

  private inputs: Input;

  private sprite: Phaser.GameObjects.Sprite;

  private typewriter: Typewriter;

  private typewriter2: Typewriter;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.setScrollFactor(0);

    this.setPosition(this.scene.renderer.width / 2, this.scene.renderer.height + scaled(32));

    this.add(this.scene.add.sprite(0, 0, Sprite.DialogBox).play(Animation.DialogBox).setScale(scaled(2)));

    this.inputs = actionInput(scene);

    this.sprite = this.scene.add.sprite(this.scene.renderer.width / -2 + scaled(32), 0, Sprite.PlayerIdle).setAlpha(0);
    this.add(this.sprite);

    this.typewriter = this.scene.add
      .existing(new Typewriter(scene))
      .setPosition(this.scene.renderer.width / -2 + scaled(64), scaled(-6));

    this.typewriter2 = this.scene.add
      .existing(new Typewriter(scene))
      .setPosition(this.scene.renderer.width / -2 + scaled(64), scaled(10));

    this.add(this.typewriter);
    this.add(this.typewriter2);

    const downArrow = scene.add
      .sprite(this.scene.renderer.width / 2 - scaled(32), scaled(16), Sprite.DownArrow)
      .play(Animation.DownArrow)
      .setDepth(1)
      .setPipeline(Shader.Outline);

    this.add(downArrow);

    this.states = states<'idle' | 'animating' | 'next line' | 'writing' | 'waiting', 'idle'>(scene, 'idle')
      .add('next line', ({ change }) => {
        this.sprite.setTexture(this.dialog[this.currentDialog].image).setAlpha(1);

        this.typewriter.setText(this.resolveNextLine1(), this.resolveCurrentLine1().length).play();

        this.typewriter2.setText(this.resolveNextLine2(), this.resolveCurrentLine2().length).play();

        change('writing');
      })
      .add('writing', ({ change, timeInState }) => {
        if (timeInState > this.typewriter.typewriteDuration()) {
          change('waiting');
        }
      })
      .add('waiting', ({ change }) => {
        if (this.inputs.wasJustActive(Action.Action)) {
          this.scene.tweens.add({
            targets: this,
            y: this.scene.renderer.height - scaled(42),
            duration: 50,
            repeat: 1,
            yoyo: true,
          });

          change(this.updateDialogIndexes());
        }
      });
  }

  public setDialog(dialog: Dialog): DialogBox {
    this.dialog = dialog;

    this.currentDialog = 0;

    this.currentLine = 0;

    this.currentSection = 0;

    return this;
  }

  public play(): DialogBox {
    if (this.states.current() !== 'idle') return this;

    this.states.change('animating');

    this.scene.tweens.add({
      targets: this,
      y: this.scene.renderer.height - scaled(36),
      ease: Phaser.Math.Easing.Back.Out,
      duration: 400,
      onComplete: () => this.states.change('next line'),
    });

    return this;
  }

  public isComplete(): boolean {
    return this.states.current() === 'idle';
  }

  private resolveCurrentLine1(): string {
    if (this.currentLine === 1) {
      return this.dialog[this.currentDialog].line1.join();
    }

    return this.dialog[this.currentDialog].line1.slice(0, this.currentSection).join();
  }

  private resolveNextLine1(): string {
    if (this.currentLine === 1) {
      return this.dialog[this.currentDialog].line1.join();
    }

    return this.dialog[this.currentDialog].line1.slice(0, this.currentSection + 1).join();
  }

  private resolveCurrentLine2(): string {
    if (this.currentLine === 0) {
      return '';
    }

    return this.dialog[this.currentDialog].line2.slice(0, this.currentSection).join();
  }

  private resolveNextLine2(): string {
    if (this.currentLine === 0) {
      return '';
    }

    return this.dialog[this.currentDialog].line2.slice(0, this.currentSection + 1).join();
  }

  private updateDialogIndexes(): 'animating' | 'next line' {
    this.currentSection++;

    const currentLine =
      this.currentLine === 0 ? this.dialog[this.currentDialog].line1 : this.dialog[this.currentDialog].line2;

    if (this.currentSection === currentLine.length) {
      this.currentSection = 0;
      this.currentLine++;
    }

    const newCurrentLine =
      this.currentLine === 0 ? this.dialog[this.currentDialog].line1 : this.dialog[this.currentDialog].line2;

    if (this.currentLine > 1 || newCurrentLine.length === 0) {
      this.currentLine = 0;
      this.currentDialog++;
    }

    if (this.currentDialog === this.dialog.length) {
      this.scene.tweens.add({
        targets: this,
        y: this.scene.renderer.height + scaled(32),
        ease: Phaser.Math.Easing.Back.In,
        duration: 400,
        onComplete: () => this.states.change('idle'),
      });

      return 'animating';
    }

    return 'next line';
  }
}
