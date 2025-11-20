export const Depth = {
  Background: 1000,
  Main: 2000,
  Foreground: 3000,
  UI: 4000,
} as const;
export type KeyOfDepth = keyof typeof Depth;
export type TypeOfDepth = (typeof Depth)[KeyOfDepth];

export const Action = {
  Up: 'up',
  Down: 'down',
  Left: 'left',
  Right: 'right',
  Action: 'action',
} as const;
export type KeyOfAction = keyof typeof Action;
export type TypeOfAction = (typeof Action)[KeyOfAction];

export const Scene = {
  Boot: 'Boot',
  Preloader: 'Preloader',
  MainMenu: 'Main Menu',
  SpringTitle: 'Spring Title',
  SpringJetty: 'Spring Jetty',
  SpringIceCube: 'Spring Ice Cube',
  SpringFlower: 'Spring Flower',
  SummerTitle: 'Summer Title',
  SummerJetty: 'Summer Jetty',
  SummerIceCube: 'Summer Ice Cube',
  SummerFlower: 'Summer Flower',
  AutumnTitle: 'Autumn Title',
  AutumnJetty: 'Autumn Jetty',
  AutumnIceCube: 'Autumn Ice Cube',
  AutumnFlower: 'Autumn Flower',
  AutumnSnowman: 'Autumn Snowman',
  AutumnIceCubeWithSnowman: 'Autumn Ice Cube With Snowman',
  WinterTitle: 'Winter Title',
  WinterIceCube: 'Winter Ice Cube',
  WinterFlower: 'Winter Flower',
  SpringAgainTitle: 'Spring Again Title',
  SpringAgainJetty: 'Spring Again Jetty',
  SpringAgainFlower: 'Spring Again Flower',
  UserInterface: 'User Interface',
  Debug: 'Debug',
  DialogBox: 'Dialog Box',
  Finish: 'Finish',
} as const;
export type KeyOfScene = keyof typeof Scene;
export type TypeOfScene = (typeof Scene)[KeyOfScene];

export const Shader = {
  Glow: 'Glow',
  Vignette: 'Vignette',
  Noise: 'Noise',
  SoftLight: 'Soft Light',
  AntiAlias: 'Anti-alias',
  Outline: 'Outline',
  OutlinePost: 'OutlinePost',
  Fade: 'Fade',
} as const;
export type KeyOfShader = keyof typeof Shader;
export type TypeOfShader = (typeof Shader)[KeyOfShader];

export const Tilemap = {
  Test: 'tilemaps/test.json',
  SpringJetty: 'tilemaps/spring_jetty_area.json',
  SpringIceCube: 'tilemaps/spring_ice_cube_area.json',
  SpringFlower: 'tilemaps/spring_flower_area.json',
  SummerJetty: 'tilemaps/summer_jetty_area.json',
  SummerIceCube: 'tilemaps/summer_ice_cube_area.json',
  SummerFlower: 'tilemaps/summer_flower_area.json',
  AutumnJetty: 'tilemaps/autumn_jetty_area.json',
  AutumnIceCube: 'tilemaps/autumn_ice_cube_area.json',
  AutumnIceCubeWithSnowman: 'tilemaps/autumn_ice_cube_with_snowman_area.json',
  AutumnSnowman: 'tilemaps/autumn_snowman_area.json',
  AutumnFlower: 'tilemaps/autumn_flower_area.json',
  WinterIceCube: 'tilemaps/winter_ice_cube_area.json',
  WinterFlower: 'tilemaps/winter_flower_area.json',
  SpringAgainJetty: 'tilemaps/spring_again_jetty_area.json',
  SpringAgainFlower: 'tilemaps/spring_again_flower_area.json',
} as const;
export type KeyOfTilemap = keyof typeof Tilemap;
export type TypeOfTilemap = (typeof Tilemap)[KeyOfTilemap];

export const Tileset = {
  Snow: 'tilemaps/snow.png',
} as const;
export type KeyOfTileset = keyof typeof Tileset;
export type TypeOfTileset = (typeof Tileset)[KeyOfTileset];

export const Sprite = {
  PushAreaImage: 'sprites/push_area.png',
  Unknown: 'sprites/unknown.png',
  Black1px: 'sprites/black_pixel.png',
  White1px: 'sprites/white_pixel.png',
  White4px: 'sprites/white_4px.png',
  White8px: 'sprites/white_8px.png',
  DebugPlayer: 'sprites/debug_player.png',
  ZButton: 'sprites/z_button.png',
  DownArrow: 'sprites/down_arrow.png',
  PlayerIdle: 'sprites/player/foo.png',
  Snow1: 'sprites/snow/snow_1.png',
  Snow2: 'sprites/snow/snow_2.png',
  Snow3: 'sprites/snow/snow_3.png',
  Snow4: 'sprites/snow/snow_4.png',
  CaveIn1: 'sprites/snow/cave_in_1.png',
  CaveIn2: 'sprites/snow/cave_in_2.png',
  CaveInWinterTop: 'sprites/cave_in_winter_top.png',
  CaveInWinterBottom: 'sprites/cave_in_winter_bottom.png',
  Jetty: 'sprites/jetty.png',
  Waves: 'sprites/waves.png',
  CliffTop: 'sprites/cliff_top.png',
  CliffBottom: 'sprites/cliff_bottom.png',
  DialogBox: 'sprites/dialog_box.png',
  Vignette: 'sprites/vignette.png',
  Puddle1: 'sprites/puddles/puddle_1.png',
  Puddle2: 'sprites/puddles/puddle_2.png',
  Leaves1: 'sprites/leaves/leaves_1.png',
  Leaves2: 'sprites/leaves/leaves_2.png',
  Umbrella: 'sprites/umbrella.png',

  Snowball: 'sprites/snow/snowball.png',

  OtherPenguinDialog: 'sprites/dialogs/other_penguin.png',
  IceCubeDialog: 'sprites/dialogs/ice_cube.png',
  ThinkingDialog: 'sprites/dialogs/thinking.png',
  SnowmanDialog: 'sprites/dialogs/snowman.png',

  PlayerSleep: 'sprites/player/player_sleep.png',
  PlayerWakeUp: 'sprites/player/wake_up.png',
  PlayerWave: 'sprites/player/player_wave.png',
  PlayerRunUp: 'sprites/player/run_up.png',
  PlayerRunDown: 'sprites/player/run_down.png',
  PlayerRunRight: 'sprites/player/run_right.png',
  PlayerIdleUp: 'sprites/player/player_idle_up.png',
  PlayerIdleDown: 'sprites/player/player_idle.png',
  PlayerIdleRight: 'sprites/player/player_idle_right.png',
  PlayerWater: 'sprites/player/player_water.png',
  PlayerStruggleRight: 'sprites/player/struggle_right.png',
  PlayerSigh: 'sprites/player/sigh.png',
  PlayerSwimUp: 'sprites/player/swim_up.png',
  PlayerSwimDown: 'sprites/player/swim_down.png',
  PlayerSwimRight: 'sprites/player/swim_right.png',
  PlayerUmbrella: 'sprites/player/player_umbrella.png',

  IceCubeRight: 'sprites/ice_cube/ice_cube_idle_right.png',
  IceCubeFrozen: 'sprites/ice_cube/frozen.png',
  IceCubeMelting: 'sprites/ice_cube/melting.png',
  IceCubePuddle: 'sprites/ice_cube/puddle.png',
  IceCubeSwimRight: 'sprites/ice_cube/ice_cube_swim_right.png',

  SnowmanIdleUp: '',
  SnowmanIdleDown: '',
  SnowmanIdleRight: 'sprites/snowman/snowman_right.png',
  SnowmanSwimUp: '',
  SnowmanSwimDown: '',
  SnowmanSwimRight: '',
  SnowmanMagic: 'sprites/snowman/snowman_magic.png',
  SnowmanNoSnowballs: 'sprites/snowman/snowman_no_balls.png',
  SnowmanOneSnowball: 'sprites/snowman/snowman_one_ball.png',
  SnowmanTwoSnowballs: 'sprites/snowman/snowman_two_balls.png',
  SnowmanCovered: '',

  MainPlant: 'sprites/plants/main_plant.png',
  MainPlantThirsty: 'sprites/plants/main_plant_thirsty.png',
  MainPlantWindy: 'sprites/plants/main_plant_windy.png',
  MainPlantSad: '',
  MainPlantWithFlower: '',
  DeadPlant1: 'sprites/plants/dead_plant_1.png',
  DeadPlant2: 'sprites/plants/dead_plant_2.png',
  DeadPlant3: 'sprites/plants/dead_plant_3.png',

  SpringIcon: 'sprites/spring_icon.png',
  SummerIcon: 'sprites/summer_icon.png',
  AutumnIcon: 'sprites/autumn_icon.png',
  WinterIcon: 'sprites/winter_icon.png',

  Fan1Off: 'sprites/fans/fan_1_off.png',
  Fan1: 'sprites/fans/fan_1.png',
  IceWall: 'sprites/ice_barrier.png',
  IceWallBroken: 'sprites/ice_barrier_broken.png',
} as const;
export type KeyOfSprite = keyof typeof Sprite;
export type TypeOfSprite = (typeof Sprite)[KeyOfSprite];

export const Font = {
  DefaultWhite: 'fonts/monogram-white.png',
  DefaultBlack: 'fonts/monogram-black.png',
  DefaultXml: 'fonts/monogram.xml',
} as const;
export type KeyOfFont = keyof typeof Font;
export type TypeOfFont = (typeof Font)[KeyOfFont];

export const Animation = {
  DebugPlayer: 'Debug Player',
  ZButton: 'Z Button',
  DownArrow: 'Down Arrow',
  DialogBox: 'Dialog Box',
  Jetty: 'Jetty',
  Waves: 'Waves',
  Vignette: 'Vignette',
  OtherPenguinDialog: 'OtherPenguinDialog',
  ThinkingDialog: 'ThinkingDialog',
  SnowmanDialog: 'SnowmanDialog',
  IceCubeDialog: 'IceCubeDialog',

  PlayerSleep: 'PlayerSleep',
  PlayerWakeUp: 'PlayerWakeUp',
  PlayerWave: 'PlayerWave',
  PlayerWater: 'PlayerWater',
  PlayerSigh: 'PlayerSigh',
  PlayerIdleDown: 'PlayerIdleDown',
  PlayerIdleUp: 'PlayerIdleUp',
  PlayerIdleRight: 'PlayerIdleRight',
  PlayerRunDown: 'PlayerRunDown',
  PlayerRunUp: 'PlayerRunUp',
  PlayerRunRight: 'PlayerRunRight',
  PlayerStruggleRight: 'PlayerStruggleRight',
  PlayerSwimDown: 'PlayerSwimDown',
  PlayerSwimUp: 'PlayerSwimUp',
  PlayerSwimRight: 'PlayerSwimRight',

  IceCubeRight: 'IceCubeRight',
  IceCubeMelting: 'IceCubeMelting',
  IceCubeSwimRight: 'IceCubeSwimRight',

  SnowmanIdleRight: 'SnowmanIdleRight',
  SnowmamNoSnowballs: 'SnowmanNoSnowballs',
  SnowmamOneSnowball: 'SnowmanOneSnowball',
  SnowmanTwoSnowballs: 'SnowmanTwoSnowballs',
  SnowmanMagic: 'SnowmanMagic',

  MainPlant: 'MainPlant',
  MainPlantThirsty: 'MainPlantThirsty',
  MainPlantWindy: 'MainPlantWindy',

  Fan1: 'Fan1',
  Fan2: 'Fan2',
  Fan3: 'Fan3',
} as const;
export type KeyOfAnimation = keyof typeof Animation;
export type TypeOfAnimation = (typeof Animation)[KeyOfAnimation];

export const CollisionTag = {
  Player: 'Player',
  Pushable: 'Pushable',
  ThrowsSnow: 'ThrowsSnow',
} as const;
export type KeyOfCollisionTag = keyof typeof CollisionTag;
export type TypeOfCollisionTag = (typeof CollisionTag)[KeyOfCollisionTag];

export const CollisionMask = {
  Default: 0x1000,
  Pushable: 0x0100,
  Yolo: 0x0000,
} as const;
export type KeyOfCollisionMask = keyof typeof CollisionMask;
export type TYPE_OF_COLLISION_MASK = (typeof CollisionMask)[KeyOfCollisionMask];

export const GlobalScale = 1;

export const Flag = {
  SkipMainMenu: 'skip_main_menu',
  OpeningCutsceneWatched: 'opening_cutscene_watched',
  OtherPenguinCutsceneWatched: 'other_penguin_cutscene_watched',
  SpringWaterFlowerCutsceneWatched: 'spring_water_flower_cutscene_watched',
  SummerWakeUpCutsceneWatched: 'summer_wake_up_cutscene_watched',
  SummerIceCubeIntroWatched: 'SummerIceCubeIntroWatched',
  SummerIceCubeFan1Activated: 'SummerIceCubeFan1Activated',
  SummerIceCubeFan2Activated: 'SummerIceCubeFan2Activated',
  SummerIceCubeFan3Activated: 'SummerIceCubeFan3Activated',
  SummerWaterFlowerCutsceneWatched: 'summer_water_flower_cutscene_watched',
  AutumnWakeUpCutsceneWatched: 'autumn_wake_up_cutscene_watched',
  AutumnSnowmanSnow1Completed: 'AutumnSnowmanSnow1Completed',
  AutumnSnowmanSnow2Completed: 'AutumnSnowmanSnow2Completed',
  AutumnSnowmanSnow3Completed: 'AutumnSnowmanSnow3Completed',
  AutumnSnowmanCompleted: 'AutumnSnowmanCompleted',
  AutumnSnowBarrierLiftCutsceneWatched: 'AutumnSnowBarrierLiftCutsceneWatched',
  AutumnWaterFlowerCutsceneWatched: 'autumn_water_flower_cutscene_watched',
  WinterIntroCutsceneWatched: 'WinterIntroCutsceneWatched',
  WinterWaterFlowerCutsceneWatched: 'WinterWaterCutsceneWatched',
  FinalSnowmanCutsceneWatched: 'FinalSnowmanCutsceneWatched',
  FinalIceCubeCutsceneWatched: 'FinalIceCubeCutsceneWatched',
  GameComplete: 'GameComplete',
} as const;
export type KeyOfFlag = keyof typeof Flag;
export type TypeOfFlag = (typeof Flag)[KeyOfFlag];

export const Sound = {
  Activate: 'audio/activate.mp3',
  Music: 'audio/music_mainloop.ogg',
} as const;
export type KeyOfSound = keyof typeof Sound;
export type TypeOfSound = (typeof Sound)[KeyOfSound];
