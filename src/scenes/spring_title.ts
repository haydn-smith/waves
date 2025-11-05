import { Typewriter } from 'common/objects/typewriter';
import { logEvent } from 'common/utils/log';
import { scaled } from 'common/utils/scaled';
import { Depth, Scene, Sprite } from 'constants';
import { camera } from 'systems/camera';
import { runCallback, runTween, sequence, wait } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class SpringTitle extends Phaser.Scene {
  private typewriter: Typewriter;

  private typewriter2: Typewriter;

  private ui: UserInterface;

  constructor() {
    super(Scene.SpringTitle);
  }

  create() {
    logEvent('Creating "Spring Title" scene.');

    this.ui = ui(this).black();

    camera(this);

    this.typewriter = this.add.existing(new Typewriter(this)).setDepth(Depth.UI).setScrollFactor(0);

    this.typewriter2 = this.add.existing(new Typewriter(this)).setDepth(Depth.UI).setScrollFactor(0);

    sequence(this)
      .of([
        wait(1000),
        runCallback(() => this.ui.fadeIn(1000, 'Linear')),
        wait(500),
        runCallback(() => this.typewriter.typewrite(`1.`)),
        wait(() => this.typewriter.typewriteDuration()),
        wait(500),
        runCallback(() => this.typewriter2.typewrite(`[sprite:${Sprite.SpringIcon}] Spring`)),
        wait(() => this.typewriter2.typewriteDuration()),
        wait(500),
        runTween(this, {
          targets: this.typewriter,
          alpha: 0,
          duration: 400,
        }),
        runTween(this, {
          targets: this.typewriter2,
          alpha: 0,
          duration: 400,
        }),
        runCallback(() => this.ui.fadeOut(1000)),
        wait(1000),
        runCallback(() => this.scene.start(Scene.SpringJetty)),
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
