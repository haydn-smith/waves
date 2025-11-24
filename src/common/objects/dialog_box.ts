import { actionInput } from 'common/factories/input';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, Sprite, TypeOfAnimation, TypeOfSprite } from 'constants';
import { Input } from 'systems/input';
import { states, States } from 'systems/states';
import { Typewriter } from './typewriter';

export type Dialog = {
  image: TypeOfSprite | TypeOfAnimation;
  line1: string[];
  line2: string[];
  autoPlaySecondLine?: boolean;
}[];

export class DialogBox extends Phaser.GameObjects.Container {
  private dialog: Dialog;

  private currentDialog: number = 0;

  private currentLine: number = 0;

  private currentSection: number = 0;

  private states: States<'idle' | 'animating' | 'next line' | 'writing' | 'waiting', 'idle'>;

  private inputs: Input;

  public sprite: Phaser.GameObjects.Sprite;

  private typewriter: Typewriter;

  private typewriter2: Typewriter;

  private arrow: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.setScrollFactor(0);

    this.setPosition(this.scene.renderer.width / 2, this.scene.renderer.height + scaled(32));

    this.add(this.scene.add.sprite(0, 0, Sprite.DialogBox).play(Animation.DialogBox).setScale(scaled(2)));

    this.inputs = actionInput(scene);

    this.sprite = this.scene.add.sprite(48, this.scene.renderer.height + 32, Sprite.Unknown);
    this.sprite.setAlpha(1).setScrollFactor(0).setDepth(1000).setScale(2);
    this.setDepth(1001);

    this.typewriter = this.scene.add
      .existing(new Typewriter(scene))
      .setPosition(this.scene.renderer.width / -2 + scaled(24), scaled(-6));

    this.typewriter2 = this.scene.add
      .existing(new Typewriter(scene))
      .setPosition(this.scene.renderer.width / -2 + scaled(24), scaled(10));

    this.add(this.typewriter);
    this.add(this.typewriter2);

    const downArrow = scene.add
      .sprite(this.scene.renderer.width / 2 - scaled(24), scaled(12), Sprite.DownArrow)
      .play(Animation.DownArrow)
      .setScale(2)
      .setDepth(1);

    this.arrow = downArrow;

    this.add(downArrow);

    this.states = states<'idle' | 'animating' | 'next line' | 'writing' | 'waiting', 'idle'>(scene, 'idle')
      .add('next line', ({ change }) => {
        if (this.sprite.anims.animationManager.exists(this.dialog[this.currentDialog].image)) {
          this.sprite.anims.play(this.dialog[this.currentDialog].image);
        } else {
          this.sprite.setTexture(this.dialog[this.currentDialog].image);
        }

        this.typewriter.setText(this.resolveNextLine1(), this.resolveCurrentLine1().length).play();

        this.typewriter2.setText(this.resolveNextLine2(), this.resolveCurrentLine2().length).play();

        change('writing');
      })
      .add('writing', ({ change, timeInState }) => {
        const duration =
          this.currentLine === 0 ? this.typewriter.typewriteDuration() : this.typewriter2.typewriteDuration();

        if (timeInState > duration) {
          if (this.currentLine === 0 && this.dialog[this.currentDialog].autoPlaySecondLine) {
            downArrow.setAlpha(0);

            change(this.updateDialogIndexes());
          } else {
            change('waiting');
          }
        }

        if (this.inputs.wasJustActive(Action.Action)) {
          if (this.currentLine === 0 && this.dialog[this.currentDialog].autoPlaySecondLine) {
            this.updateDialogIndexes();
          }

          this.typewriter.setText(this.resolveNextLine1(), this.resolveNextLine1().length).play();

          this.typewriter2.setText(this.resolveNextLine2(), this.resolveNextLine2().length).play();

          change('waiting');
        }
      })
      .add('waiting', ({ change }) => {
        downArrow.setAlpha(1);

        if (this.inputs.wasJustActive(Action.Action)) {
          downArrow.setAlpha(0);

          this.scene.tweens.add({
            targets: this,
            y: this.scene.renderer.height - scaled(42),
            duration: 50,
            repeat: 1,
            yoyo: true,
          });

          this.scene.tweens.add({
            targets: this.sprite,
            y: this.scene.renderer.height - scaled(82),
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

    this.arrow.setAlpha(0);
    this.setVisible(true);
    this.sprite.setVisible(true);

    if (this.sprite.anims.animationManager.exists(this.dialog[this.currentDialog].image)) {
      this.sprite.anims.play(this.dialog[this.currentDialog].image);
    } else {
      this.sprite.setTexture(this.dialog[this.currentDialog].image);
    }

    this.typewriter.setText('');
    this.typewriter2.setText('');

    this.scene.tweens.add({
      targets: this,
      y: this.scene.renderer.height - scaled(36),
      ease: Phaser.Math.Easing.Back.Out,
      duration: 400,
    });

    this.scene.tweens.add({
      targets: this.sprite,
      delay: 50,
      y: this.scene.renderer.height - 86,
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
      return this.dialog[this.currentDialog].line1.join('');
    }

    return this.dialog[this.currentDialog].line1.slice(0, this.currentSection).join('');
  }

  private resolveNextLine1(): string {
    if (this.currentLine === 1) {
      return this.dialog[this.currentDialog].line1.join('');
    }

    return this.dialog[this.currentDialog].line1.slice(0, this.currentSection + 1).join('');
  }

  private resolveCurrentLine2(): string {
    if (this.currentLine === 0) {
      return '';
    }

    return this.dialog[this.currentDialog].line2.slice(0, this.currentSection).join('');
  }

  private resolveNextLine2(): string {
    if (this.currentLine === 0) {
      return '';
    }

    return this.dialog[this.currentDialog].line2.slice(0, this.currentSection + 1).join('');
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
      });

      this.scene.tweens.add({
        targets: this.sprite,
        y: this.scene.renderer.height + scaled(32),
        ease: Phaser.Math.Easing.Back.In,
        duration: 400,
        delay: 50,
        onComplete: () => {
          this.states.change('idle');
          this.setVisible(false);
          this.sprite.setVisible(false);
        },
      });

      return 'animating';
    }

    return 'next line';
  }
}
