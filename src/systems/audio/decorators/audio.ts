import { Audio as AudioObject } from 'systems/audio/objects/audio';

export class Audio {
  constructor(private audio: AudioObject) {}

  public fadeIn(volume: number): this {
    this.setVolume(0);

    this.audio.scene.tweens
      .add({
        targets: this.audio,
        props: {
          volume: { from: 0, to: volume },
        },
        duration: 3000,
        onUpdate: (_tween, _target, _key, current) => {
          this.setVolume(current);
        },
      })
      .play();

    this.play();

    return this;
  }

  public fadeOut(): this {
    this.audio.scene.tweens
      .add({
        targets: this.audio,
        props: {
          volume: { to: 0, from: this.volume() },
        },
        duration: 3000,
        onUpdate: (_tween, _target, _key, current) => {
          this.setVolume(current);
        },
        onComplete: () => {
          this.stop();
        },
      })
      .play();

    return this;
  }

  public destroy(): void {
    this.audio.destroy();
  }

  public volume(): number {
    return this.audio.volume();
  }

  public isLooping(): boolean {
    return this.audio.isLooping();
  }

  public isPlaying(): boolean {
    return this.audio.isPlaying();
  }

  public loop(): Audio {
    this.audio.loop();

    return this;
  }

  public dontLoop(): Audio {
    this.audio.dontLoop();

    return this;
  }

  public play(): Audio {
    this.audio.play();

    return this;
  }

  public pause(): Audio {
    this.audio.pause();

    return this;
  }

  public stop(): Audio {
    this.audio.stop();

    return this;
  }

  public toggle(): Audio {
    this.audio.toggle();

    return this;
  }

  public setVolume(volume: number): Audio {
    this.audio.withVolume(volume);

    return this;
  }
}
