import { scaled } from 'common/utils/scaled';
import { Animation, Font, GlobalScale, Shader } from 'constants';
import { debugDepth } from 'systems/flags';

export class Typewriter extends Phaser.GameObjects.Container {
  private textObjects: (Phaser.GameObjects.BitmapText | Phaser.GameObjects.Sprite)[] = [];

  private textWidth = 0;

  private textHeight = 0;

  private typeFrom = 0;

  private linePadding = scaled(4);

  private unusedTextObjects: Phaser.GameObjects.BitmapText[] = [];

  private tweens: Phaser.Tweens.Tween[] = [];

  constructor(
    scene: Phaser.Scene,
    private font: string = Font.DefaultWhite
  ) {
    super(scene);

    this.setScrollFactor(0);
    this.setPosition(this.scene.renderer.width / 2, this.scene.renderer.height / 2);
    this.setDepth(debugDepth());
  }

  public setText(text: string, typeFrom: number = 0): Typewriter {
    this.textObjects.forEach((to) => {
      if (to.type === 'Sprite') {
        to.destroy();
      } else {
        this.unusedTextObjects.push(to);
        to.setVisible(false);
      }
    });
    this.tweens.forEach((t) => t.destroy());
    this.tweens = [];
    this.textWidth = 0;
    this.textHeight = scaled(-12);
    this.typeFrom = typeFrom;

    this.textObjects = [];
    const chars = text.split('');
    for (let index = 0; index < chars.length; index++) {
      const c = chars[index];

      if (c !== '[') {
        let text = this.unusedTextObjects.pop();

        if (!text) {
          text = this.scene.add
            .bitmapText(this.textWidth, this.textHeight, this.font, c)
            .setPostPipeline(Shader.Fade)
            .setVisible(!(index >= typeFrom));
        } else {
          text
            .setPosition(this.textWidth, this.textHeight)
            .setVisible(!(index >= typeFrom))
            .setText(c);
        }

        // (text.getPostPipeline(Shader.Fade) as Fade).progress = index >= typeFrom ? 1 : 0;

        this.textWidth += text.width;

        if (c === '\n') {
          this.textHeight += scaled(8) + this.linePadding;
          this.textWidth = 0;
        }

        this.add(text);

        this.textObjects.push(text);
      } else {
        const sprite = (text.substring(index, text.length).match('([^\\]]*)') ?? [])[0] ?? '';
        const [type, key] = sprite.replace('[', '').replace(']', '').split(':');

        const obj = this.scene.add
          .sprite(this.textWidth, this.textHeight, key)
          .setOrigin(0, 0)
          .setVisible(!(index >= typeFrom))
          .setScale(GlobalScale)
          .setPostPipeline(Shader.Fade);

        // (obj.getPostPipeline(Shader.Fade) as Fade).progress = index >= typeFrom ? 1 : 0;

        const actualKey = Object.values(Animation).find((animation) => animation === key);

        if (type === 'animation' && actualKey) {
          obj.anims.play(actualKey);
        }

        this.textWidth += obj.displayWidth;

        this.add(obj);

        this.textObjects.push(obj);

        index += sprite.length;
      }
    }

    return this;
  }

  public play(): Typewriter {
    this.textObjects.forEach((o, index) => {
      if (index < this.typeFrom) return;

      this.tweens.push(
        this.scene.tweens.add({
          targets: o,
          duration: 250,
          delay: (index - this.typeFrom) * 30,
          props: {
            y: {
              ease: 'Back.Out',
              to: o.y,
              from: o.y + scaled(16),
            },
            // glowAlpha: { from: 1, to: 0 },
          },
          onUpdate: () => {
            o.setVisible(true);
          },
          // onUpdate: (tween, target, key, current) => {
          //   if (key === 'glowAlpha') {
          //     (o.getPostPipeline(Shader.Fade) as Fade).progress = current;
          //   }
          // },
        })
      );
    });

    return this;
  }

  public typewrite(text: string, from: number = 0): Typewriter {
    return this.setText(text, from).play();
  }

  public typewriteDuration(): number {
    return (this.textObjects.length - 1 - this.typeFrom) * 30 + 250;
  }

  public typewriterWidth(): number {
    const left = this.textObjects.map((o) => o.x).sort((a, b) => a - b)[0] ?? 0;

    const right =
      this.textObjects
        .map((o) => o.x + o.w)
        .sort((a, b) => a - b)
        .reverse()[0] ?? 0;

    return right - left;
  }
}
