import { Fade } from 'common/objects/shaders/fade';
import { Shader } from 'constants';

export class Fader extends Phaser.GameObjects.Container {
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.addToUpdateList();

    this.graphics = this.scene.add.graphics();

    this.add(this.graphics);

    this.setScrollFactor(0).setAlpha(0);
  }

  public preUpdate() {
    this.graphics
      .setDepth(this.depth)
      .clear()
      .fillStyle(0x000000, 1)
      .fillRect(0, 0, this.scene.game.renderer.width, this.scene.game.renderer.height);
  }

  public fadeIn(duration: number = 800, ease: string = 'Quadratic.InOut'): Fader {
    this.scene.tweens.add({
      targets: this.scene.cameras.main,
      ease: 'Linear',
      duration,
      props: { glowAlpha: { from: 1, to: 0 } },
      onUpdate: (_tween, _target, _key, current) => {
        (this.scene.cameras.main.getPostPipeline(Shader.Fade) as Fade).progress = current;
      },
    });

    return this;
  }

  public fadeOut(duration: number = 800, ease: string = 'Quadratic.InOut'): Fader {
    this.scene.tweens.add({
      targets: this.scene.cameras.main,
      ease: 'Linear',
      duration,
      props: { glowAlpha: { from: 0, to: 1 } },
      onUpdate: (_tween, _target, _key, current) => {
        (this.scene.cameras.main.getPostPipeline(Shader.Fade) as Fade).progress = current;
      },
    });

    return this;
  }

  public setFade(alpha: number): Fader {
    (this.scene.cameras.main.getPostPipeline(Shader.Fade) as Fade).progress = alpha;

    return this;
  }
}
