import { Typewriter } from 'common/objects/typewriter';
import { fadeAudioVolume, getWindAudio } from 'common/utils/getWindAudio';
import { logEvent } from 'common/utils/log';
import { scaled } from 'common/utils/scaled';
import { Depth, Scene, Shader, Sprite } from 'constants';
import { camera } from 'systems/camera';
import { runCallback, runTween, sequence, wait } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class AutumnTitle extends Phaser.Scene {
  private typewriter: Typewriter;

  private typewriter2: Typewriter;

  private ui: UserInterface;

  constructor() {
    super(Scene.AutumnTitle);
  }

  create() {
    logEvent('Creating "Autumn Title" scene.');

    this.ui = ui(this).black();

    camera(this);

    this.typewriter = this.add
      .existing(new Typewriter(this))
      .setDepth(Depth.UI)
      .setScrollFactor(0)
      .setPostPipeline(Shader.Fade);

    this.typewriter2 = this.add
      .existing(new Typewriter(this))
      .setDepth(Depth.UI)
      .setScrollFactor(0)
      .setPostPipeline(Shader.Fade);

    sequence(this)
      .of([
        runCallback(() => this.ui.fadeIn(1000, 'Linear')),
        wait(1000),
        runCallback(() => {
          this.typewriter.typewrite(`2.`);

          const wind = getWindAudio(this);
          wind.setVolume(0);
          fadeAudioVolume(this, wind, 0.1);
          wind.play();
        }),
        wait(() => this.typewriter.typewriteDuration()),
        wait(500),
        runCallback(() => this.typewriter2.typewrite(`[sprite:${Sprite.AutumnIcon}] Autumn`)),
        wait(() => this.typewriter2.typewriteDuration()),
        wait(500),
        runTween(this, {
          targets: this.typewriter,
          ease: 'Linear',
          duration: 400,
          props: { glowAlpha: { from: 0, to: 1 } },
          onUpdate: (_tween, _target, _key, current) => {
            (this.typewriter.getPostPipeline(Shader.Fade) as Fade).progress = current;
          },
        }),
        runTween(this, {
          targets: this.typewriter2,
          ease: 'Linear',
          duration: 400,
          props: { glowAlpha: { from: 0, to: 1 } },
          onUpdate: (_tween, _target, _key, current) => {
            (this.typewriter2.getPostPipeline(Shader.Fade) as Fade).progress = current;
          },
        }),
        runCallback(() => this.ui.fadeOut(1000)),
        wait(1000),
        runCallback(() => this.scene.start(Scene.AutumnJetty)),
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
      this.renderer.width / 2 - this.typewriter2.typewriterWidth() / 2 - 5,
      this.renderer.height / 2 + scaled(16)
    );
  }
}
