import { Antialias } from 'common/objects/shaders/anti_alias';
import { Fade } from 'common/objects/shaders/fade';
import { Glow } from 'common/objects/shaders/glow';
import { Noise } from 'common/objects/shaders/noise';
import { Outline } from 'common/objects/shaders/outline';
import { OutlinePost } from 'common/objects/shaders/outline_post';
import { SoftLight } from 'common/objects/shaders/soft_light';
import { Vignette } from 'common/objects/shaders/vignette';
import { setData } from 'common/utils/data';
import { logEvent } from 'common/utils/log';
import { scaled } from 'common/utils/scaled';
import { Animation, Depth, Font, Scene, Shader, Sound, Sprite, Tilemap, Tileset } from 'constants';
import { setDebug } from 'systems/flags';
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
    this.load.tilemapTiledJSON(Tilemap.SpringIceCube, Tilemap.SpringIceCube);
    this.load.tilemapTiledJSON(Tilemap.SpringFlower, Tilemap.SpringFlower);
    this.load.tilemapTiledJSON(Tilemap.SummerJetty, Tilemap.SummerJetty);
    this.load.tilemapTiledJSON(Tilemap.SummerIceCube, Tilemap.SummerIceCube);
    this.load.tilemapTiledJSON(Tilemap.SummerFlower, Tilemap.SummerFlower);
    this.load.tilemapTiledJSON(Tilemap.AutumnJetty, Tilemap.AutumnJetty);
    this.load.tilemapTiledJSON(Tilemap.AutumnIceCube, Tilemap.AutumnIceCube);
    this.load.tilemapTiledJSON(Tilemap.AutumnIceCubeWithSnowman, Tilemap.AutumnIceCubeWithSnowman);
    this.load.tilemapTiledJSON(Tilemap.AutumnSnowman, Tilemap.AutumnSnowman);
    this.load.tilemapTiledJSON(Tilemap.AutumnFlower, Tilemap.AutumnFlower);
    this.load.tilemapTiledJSON(Tilemap.WinterIceCube, Tilemap.WinterIceCube);
    this.load.tilemapTiledJSON(Tilemap.WinterFlower, Tilemap.WinterFlower);
    this.load.tilemapTiledJSON(Tilemap.SpringAgainJetty, Tilemap.SpringAgainJetty);
    this.load.tilemapTiledJSON(Tilemap.SpringAgainFlower, Tilemap.SpringAgainFlower);

    // Sprites.
    this.load.image(Sprite.Black1px, Sprite.Black1px);
    this.load.image(Sprite.White1px, Sprite.White1px);
    this.load.image(Sprite.White4px, Sprite.White4px);
    this.load.image(Sprite.White8px, Sprite.White8px);
    this.load.image(Sprite.Snow1, Sprite.Snow1);
    this.load.image(Sprite.Snow2, Sprite.Snow2);
    this.load.image(Sprite.Snow3, Sprite.Snow3);
    this.load.image(Sprite.Snow4, Sprite.Snow4);
    this.load.image(Sprite.Puddle1, Sprite.Puddle1);
    this.load.image(Sprite.Puddle2, Sprite.Puddle2);
    this.load.image(Sprite.Leaves1, Sprite.Leaves1);
    this.load.image(Sprite.Leaves2, Sprite.Leaves2);
    this.load.image(Sprite.CaveIn1, Sprite.CaveIn1);
    this.load.image(Sprite.CaveIn2, Sprite.CaveIn2);
    this.load.image(Sprite.CaveInWinterTop, Sprite.CaveInWinterTop);
    this.load.image(Sprite.CaveInWinterBottom, Sprite.CaveInWinterBottom);
    this.load.image(Sprite.CaveInSpringAgain, Sprite.CaveInSpringAgain);
    this.load.image(Sprite.Snowball, Sprite.Snowball);
    this.load.image(Sprite.CliffTop, Sprite.CliffTop);
    this.load.image(Sprite.CliffBottom, Sprite.CliffBottom);
    this.load.image(Sprite.IceWall, Sprite.IceWall);
    this.load.image(Sprite.IceWallBroken, Sprite.IceWallBroken);
    this.load.image(Sprite.PlayerUmbrella, Sprite.PlayerUmbrella);
    this.load.image(Sprite.Umbrella, Sprite.Umbrella);
    this.load.spritesheet(Sprite.Jetty, Sprite.Jetty, {
      frameWidth: 128,
    });
    this.load.spritesheet(Sprite.Waves, Sprite.Waves, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.Vignette, Sprite.Vignette, {
      frameWidth: 320,
      frameHeight: 240,
    });
    this.load.spritesheet(Sprite.MainPlant, Sprite.MainPlant, {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet(Sprite.MainPlantWithFlower, Sprite.MainPlantWithFlower, {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet(Sprite.MainPlantThirsty, Sprite.MainPlantThirsty, {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet(Sprite.MainPlantWindy, Sprite.MainPlantWindy, {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.image(Sprite.DeadPlant1, Sprite.DeadPlant1);
    this.load.image(Sprite.DeadPlant2, Sprite.DeadPlant2);
    this.load.image(Sprite.DeadPlant3, Sprite.DeadPlant3);
    this.load.image(Sprite.SpringIcon, Sprite.SpringIcon);
    this.load.image(Sprite.AutumnIcon, Sprite.AutumnIcon);
    this.load.image(Sprite.SummerIcon, Sprite.SummerIcon);
    this.load.image(Sprite.WinterIcon, Sprite.WinterIcon);
    this.load.image(Sprite.PushAreaImage, Sprite.PushAreaImage);
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
    this.load.spritesheet(Sprite.OtherPenguinDialog, Sprite.OtherPenguinDialog, {
      frameWidth: 64,
      frameHeight: 32,
    });
    this.load.spritesheet(Sprite.ThinkingDialog, Sprite.ThinkingDialog, {
      frameWidth: 64,
      frameHeight: 32,
    });
    this.load.spritesheet(Sprite.SnowmanDialog, Sprite.SnowmanDialog, {
      frameWidth: 64,
      frameHeight: 32,
    });
    this.load.spritesheet(Sprite.IceCubeDialog, Sprite.IceCubeDialog, {
      frameWidth: 64,
      frameHeight: 32,
    });
    this.load.spritesheet(Sprite.PlayerSleep, Sprite.PlayerSleep, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerWakeUp, Sprite.PlayerWakeUp, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerWave, Sprite.PlayerWave, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerWater, Sprite.PlayerWater, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerSigh, Sprite.PlayerSigh, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerIdleDown, Sprite.PlayerIdleDown, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerIdleUp, Sprite.PlayerIdleUp, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerIdleRight, Sprite.PlayerIdleRight, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerRunDown, Sprite.PlayerRunDown, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerRunUp, Sprite.PlayerRunUp, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerRunRight, Sprite.PlayerRunRight, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerStruggleRight, Sprite.PlayerStruggleRight, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerSwimDown, Sprite.PlayerSwimDown, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerSwimUp, Sprite.PlayerSwimUp, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.PlayerSwimRight, Sprite.PlayerSwimRight, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.IceCubeRight, Sprite.IceCubeRight, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.IceCubeSwimRight, Sprite.IceCubeSwimRight, {
      frameWidth: 32,
    });
    this.load.image(Sprite.IceCubeFrozen, Sprite.IceCubeFrozen);
    this.load.spritesheet(Sprite.IceCubeMelting, Sprite.IceCubeMelting, {
      frameWidth: 32,
    });
    this.load.image(Sprite.IceCubePuddle, Sprite.IceCubePuddle);

    this.load.image(Sprite.Fan1Off, Sprite.Fan1Off);
    this.load.spritesheet(Sprite.Fan1, Sprite.Fan1, {
      frameWidth: 64,
    });
    this.load.spritesheet(Sprite.SnowmanIdleRight, Sprite.SnowmanIdleRight, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.SnowmanSwimRight, Sprite.SnowmanSwimRight, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.SnowmanNoSnowballs, Sprite.SnowmanNoSnowballs, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.SnowmanOneSnowball, Sprite.SnowmanOneSnowball, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.SnowmanTwoSnowballs, Sprite.SnowmanTwoSnowballs, {
      frameWidth: 32,
    });
    this.load.spritesheet(Sprite.SnowmanMagic, Sprite.SnowmanMagic, {
      frameWidth: 32,
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
      this.sys.renderer.pipelines.addPostPipeline(Shader.OutlinePost, OutlinePost);
      this.sys.renderer.pipelines.addPostPipeline(Shader.Glow, Glow);
      this.sys.renderer.pipelines.addPostPipeline(Shader.Vignette, Vignette);
      this.sys.renderer.pipelines.addPostPipeline(Shader.Noise, Noise);
      this.sys.renderer.pipelines.addPostPipeline(Shader.SoftLight, SoftLight);
      this.sys.renderer.pipelines.addPostPipeline(Shader.AntiAlias, Antialias);
      this.sys.renderer.pipelines.addPostPipeline(Shader.Fade, Fade);
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
    this.anims.create({
      key: Animation.Jetty,
      frames: Sprite.Jetty,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.Waves,
      frames: Sprite.Waves,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.Vignette,
      frames: Sprite.Vignette,
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.OtherPenguinDialog,
      frames: Sprite.OtherPenguinDialog,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.ThinkingDialog,
      frames: Sprite.ThinkingDialog,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.SnowmanDialog,
      frames: Sprite.SnowmanDialog,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.IceCubeDialog,
      frames: Sprite.IceCubeDialog,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerSleep,
      frames: Sprite.PlayerSleep,
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerWave,
      frames: Sprite.PlayerWave,
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerSigh,
      frames: Sprite.PlayerSigh,
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerWakeUp,
      frames: Sprite.PlayerWakeUp,
      frameRate: 3,
      repeat: 0,
    });
    this.anims.create({
      key: Animation.PlayerWater,
      frames: Sprite.PlayerWater,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerIdleDown,
      frames: Sprite.PlayerIdleDown,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerIdleUp,
      frames: Sprite.PlayerIdleUp,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerIdleRight,
      frames: Sprite.PlayerIdleRight,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerRunDown,
      frames: Sprite.PlayerRunDown,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerRunUp,
      frames: Sprite.PlayerRunUp,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerRunRight,
      frames: Sprite.PlayerRunRight,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerStruggleRight,
      frames: Sprite.PlayerStruggleRight,
      frameRate: 1.5,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerSwimDown,
      frames: Sprite.PlayerSwimDown,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerSwimUp,
      frames: Sprite.PlayerSwimUp,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.PlayerSwimRight,
      frames: Sprite.PlayerSwimRight,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.IceCubeRight,
      frames: Sprite.IceCubeRight,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.IceCubeSwimRight,
      frames: Sprite.IceCubeSwimRight,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.IceCubeMelting,
      frames: Sprite.IceCubeMelting,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.MainPlant,
      frames: Sprite.MainPlant,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.MainPlantWithFlower,
      frames: Sprite.MainPlantWithFlower,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.MainPlantThirsty,
      frames: Sprite.MainPlantThirsty,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.MainPlantWindy,
      frames: Sprite.MainPlantWindy,
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.Fan1,
      frames: Sprite.Fan1,
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.SnowmanIdleRight,
      frames: Sprite.SnowmanIdleRight,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.SnowmanSwimRight,
      frames: Sprite.SnowmanSwimRight,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.SnowmamNoSnowballs,
      frames: Sprite.SnowmanNoSnowballs,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.SnowmamOneSnowball,
      frames: Sprite.SnowmanOneSnowball,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.SnowmanTwoSnowballs,
      frames: Sprite.SnowmanTwoSnowballs,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.SnowmanMagic,
      frames: Sprite.SnowmanMagic,
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

    // Debug setup.
    localStorage.clear();
    setDebug(false);
    // setFlag(Flag.SummerWakeUpCutsceneWatched);
    // setFlag(Flag.AutumnSnowmanSnow2Completed);
    // setFlag(Flag.AutumnSnowmanCompleted);
    setData('previousScene', Scene.SpringJetty);

    // Start game.
    this.scene.run(Scene.DialogBox);
    this.scene.start(Scene.WinterIceCube);
  }
}
