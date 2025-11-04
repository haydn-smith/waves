import { Antialias } from 'common/objects/shaders/anti_alias';
import { Glow } from 'common/objects/shaders/glow';
import { Noise } from 'common/objects/shaders/noise';
import { Outline } from 'common/objects/shaders/outline';
import { SoftLight } from 'common/objects/shaders/soft_light';
import { Vignette } from 'common/objects/shaders/vignette';
import { logEvent } from 'common/utils/log';
import { scaled } from 'common/utils/scaled';
import { Animation, Depth, Font, Scene, Shader, Sound, Sprite, Tilemap, Tileset } from 'constants';
import { startUI } from 'systems/ui';

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.add
      .rectangle(
        this.renderer.width / 2 - scaled(32),
        this.renderer.height / 2 - scaled(2),
        scaled(64),
        scaled(1),
        0xffffff
      )
      .setOrigin(0, 0);
    this.add
      .rectangle(
        this.renderer.width / 2 - scaled(32),
        this.renderer.height / 2 + scaled(2),
        scaled(64),
        scaled(1),
        0xffffff
      )
      .setOrigin(0, 0);
    this.add
      .rectangle(
        this.renderer.width / 2 - scaled(33),
        this.renderer.height / 2 - scaled(1),
        scaled(1),
        scaled(3),
        0xffffff
      )
      .setOrigin(0, 0);
    this.add
      .rectangle(
        this.renderer.width / 2 + scaled(32),
        this.renderer.height / 2 - scaled(1),
        scaled(1),
        scaled(3),
        0xffffff
      )
      .setOrigin(0, 0);

    const bar = this.add
      .rectangle(
        this.renderer.width / 2 - scaled(32),
        this.renderer.height / 2 - scaled(2),
        scaled(0),
        scaled(4),
        0xffffff
      )
      .setOrigin(0, 0);

    this.load.on('progress', (progress: number) => {
      bar.width = progress * scaled(64);
    });
  }

  preload() {
    this.load.setPath('assets');

    // Fonts.
    this.load.bitmapFont(Font.DefaultWhite, Font.DefaultWhite, Font.DefaultXml);
    this.load.bitmapFont(Font.DefaultBlack, Font.DefaultBlack, Font.DefaultXml);

    // Tilemaps.
    this.load.image(Tileset.Snow, Tileset.Snow);
    this.load.tilemapTiledJSON(Tilemap.Test, Tilemap.Test);
    this.load.tilemapTiledJSON(Tilemap.SpringJetty, Tilemap.SpringJetty);

    // Sprites.
    this.load.image(Sprite.Black1px, Sprite.Black1px);
    this.load.image(Sprite.White1px, Sprite.White1px);
    this.load.image(Sprite.PlayerIdle, Sprite.PlayerIdle);
    this.load.image(Sprite.PlayerWater, Sprite.PlayerWater);
    this.load.image(Sprite.PlayerSleep, Sprite.PlayerSleep);
    this.load.image(Sprite.PlayerWave, Sprite.PlayerWave);
    this.load.image(Sprite.Snow1, Sprite.Snow1);
    this.load.image(Sprite.Snow2, Sprite.Snow2);
    this.load.image(Sprite.Snow3, Sprite.Snow3);
    this.load.image(Sprite.Snow4, Sprite.Snow4);
    this.load.image(Sprite.Jetty, Sprite.Jetty);
    this.load.image(Sprite.MainPlant, Sprite.MainPlant);
    this.load.image(Sprite.DeadPlant1, Sprite.DeadPlant1);
    this.load.image(Sprite.DeadPlant2, Sprite.DeadPlant2);
    this.load.image(Sprite.DeadPlant3, Sprite.DeadPlant3);
    this.load.image(Sprite.SpringIcon, Sprite.SpringIcon);
    this.load.spritesheet(Sprite.DialogBox, Sprite.DialogBox, {
      frameWidth: 160,
      frameHeight: 32,
    });
    this.load.spritesheet(Sprite.DebugPlayer, Sprite.DebugPlayer, {
      frameWidth: 16,
    });
    this.load.spritesheet(Sprite.ZButton, Sprite.ZButton, {
      frameWidth: 16,
    });
    this.load.spritesheet(Sprite.DownArrow, Sprite.DownArrow, {
      frameWidth: 16,
    });

    // Audio.
    this.load.audio(Sound.Activate, Sound.Activate);
    this.load.audio(Sound.Music, Sound.Music);
  }

  create() {
    logEvent('Creating "Preloader" scene.');

    // Register global shaders.
    if (this.sys.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
      this.sys.renderer.pipelines.add(Shader.Outline, new Outline(this.game));
      this.sys.renderer.pipelines.addPostPipeline(Shader.Glow, Glow);
      this.sys.renderer.pipelines.addPostPipeline(Shader.Vignette, Vignette);
      this.sys.renderer.pipelines.addPostPipeline(Shader.Noise, Noise);
      this.sys.renderer.pipelines.addPostPipeline(Shader.SoftLight, SoftLight);
      this.sys.renderer.pipelines.addPostPipeline(Shader.AntiAlias, Antialias);
    }

    // Register global animations.
    this.anims.create({
      key: Animation.DebugPlayer,
      frames: Sprite.DebugPlayer,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.ZButton,
      frames: Sprite.ZButton,
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.DownArrow,
      frames: Sprite.DownArrow,
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.DialogBox,
      frames: Sprite.DialogBox,
      frameRate: 3,
      repeat: -1,
    });

    // Start management scenes.
    startUI(this, {
      depth: Depth.UI,
      debugFont: Font.DefaultWhite,
    });

    // Allow the sound to play.
    this.sound.unlock();

    // Start game.
    this.scene.run(Scene.DialogBox);
    this.scene.start(Scene.SpringJetty);
  }
}
