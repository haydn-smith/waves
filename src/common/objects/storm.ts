import { Depth, Sprite } from 'constants';

export class Storm extends Phaser.GameObjects.GameObject {
  private smallScrollFactor = 1.2;
  private mediumScrollFactor = 1.5;
  private largeScrollFactor = 1.8;

  private smallSnow: Phaser.GameObjects.Particles.ParticleEmitter;
  private mediumSnow: Phaser.GameObjects.Particles.ParticleEmitter;
  private largeSnow: Phaser.GameObjects.Particles.ParticleEmitter;

  private lastCameraPosition: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

  constructor(scene: Phaser.Scene) {
    super(scene, 'Snowstorm');

    this.addToUpdateList();
    this.renderFlags = 0;

    this.smallSnow = scene.add
      .particles(0, 0, Sprite.White1px, {
        lifespan: 3000,
        speed: { min: 5 * this.smallScrollFactor, max: 10 * this.smallScrollFactor },
        angle: { min: 160 + 180, max: 200 + 180 },
        frequency: 100,
        quantity: 1,
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Rectangle(
            this.scene.renderer.width * -1,
            this.scene.renderer.height * -1,
            this.scene.renderer.width * 3,
            this.scene.renderer.height * 3
          ) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
        },
      })
      .setDepth(Depth.Foreground);

    this.mediumSnow = scene.add
      .particles(0, 0, Sprite.White4px, {
        lifespan: 3000,
        speed: { min: 5 * this.mediumScrollFactor, max: 10 * this.mediumScrollFactor },
        angle: { min: 160 + 180, max: 200 + 180 },
        frequency: 500,
        quantity: 1,
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Rectangle(
            this.scene.renderer.width * -0.5,
            this.scene.renderer.height * -0.5,
            this.scene.renderer.width * 1.5,
            this.scene.renderer.height * 1.5
          ) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
        },
      })
      .setDepth(Depth.Foreground);

    this.largeSnow = scene.add
      .particles(0, 0, Sprite.White8px, {
        lifespan: 3000,
        speed: { min: 5 * this.largeScrollFactor, max: 10 * this.largeScrollFactor },
        angle: { min: 160 + 180, max: 200 + 180 },
        frequency: 3000,
        quantity: 1,
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Rectangle(
            this.scene.renderer.width * -1,
            this.scene.renderer.height * -1,
            this.scene.renderer.width * 3,
            this.scene.renderer.height * 3
          ) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
        },
      })
      .setDepth(Depth.Foreground);

    this.idleIntensity();
  }

  public preUpdate() {
    const camera = this.scene.cameras.main;
    const position = new Phaser.Math.Vector2(camera.scrollX, camera.scrollY);
    const moved = this.lastCameraPosition.clone().subtract(position);

    this.smallSnow.setPosition(position.x, position.y);
    this.mediumSnow.setPosition(position.x, position.y);
    this.largeSnow.setPosition(position.x, position.y);

    this.smallSnow.forEachAlive((p) => {
      p.setPosition(p.x + moved.x * this.smallScrollFactor, p.y + moved.y * this.smallScrollFactor);
    }, {});
    this.mediumSnow.forEachAlive((p) => {
      p.setPosition(p.x + moved.x * this.mediumScrollFactor, p.y + moved.y * this.mediumScrollFactor);
    }, {});
    this.largeSnow.forEachAlive((p) => {
      p.setPosition(p.x + moved.x * this.largeScrollFactor, p.y + moved.y * this.largeScrollFactor);
    }, {});

    this.lastCameraPosition = position;
  }

  public idleIntensity() {
    this.updateSnowstormParticles(0.5);

    return this;
  }

  public lowIntensity() {
    this.updateSnowstormParticles(1.5);

    return this;
  }

  public mediumIntensity() {
    this.updateSnowstormParticles(2);

    return this;
  }

  public highIntensity() {
    this.updateSnowstormParticles(4);

    return this;
  }

  public extremeIntensity() {
    this.updateSnowstormParticles(6);

    return this;
  }

  private updateSnowstormParticles(factor: number) {
    this.smallSnow.updateConfig({
      speed: { min: 6 * this.smallScrollFactor * factor, max: 10 * this.smallScrollFactor * factor },
      frequency: 200 / factor,
      quantity: 1 * factor * 9,
    });

    this.mediumSnow.updateConfig({
      speed: { min: 12 * this.smallScrollFactor * factor, max: 20 * this.smallScrollFactor * factor },
      frequency: 1000 / factor,
      quantity: 1 * factor * 9,
    });

    this.largeSnow.updateConfig({
      speed: { min: 24 * this.smallScrollFactor * factor, max: 40 * this.smallScrollFactor * factor },
      frequency: 6000 / factor,
      quantity: 1 * factor * 9,
    });
  }
}
