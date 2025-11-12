import { Typewriter } from 'common/objects/typewriter';
import { logEvent } from 'common/utils/log';
import { scaled } from 'common/utils/scaled';
import { Depth, Scene } from 'constants';
import { camera } from 'systems/camera';
import { runCallback, sequence, wait } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class Finish extends Phaser.Scene {
  private typewriter: Typewriter;

  private typewriter2: Typewriter;

  private ui: UserInterface;

  constructor() {
    super(Scene.Finish);
  }

  create() {
    logEvent('Creating "Finish" scene.');

    this.ui = ui(this).black();

    camera(this);

    this.typewriter = this.add.existing(new Typewriter(this)).setDepth(Depth.UI).setScrollFactor(0);

    this.typewriter2 = this.add.existing(new Typewriter(this)).setDepth(Depth.UI).setScrollFactor(0);

    sequence(this)
      .of([
        wait(1000),
        runCallback(() => this.ui.fadeIn(1000, 'Linear')),
        wait(500),
        runCallback(() => this.typewriter.typewrite(`Finish!`)),
        wait(() => this.typewriter.typewriteDuration()),
        wait(500),
        runCallback(() => this.typewriter2.typewrite(`Thanks for playing!`)),
      ])
      .start()
      .destroyWhenComplete();
  }

  update() {
    this.typewriter.setPosition(
      this.renderer.width / 2 - this.typewriter.typewriterWidth() / 2,
      this.renderer.height / 2
    );

    this.typewriter2.setPosition(
      this.renderer.width / 2 - this.typewriter2.typewriterWidth() / 2,
      this.renderer.height / 2 + scaled(16)
    );
  }
}
