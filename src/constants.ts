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
  UserInterface: 'User Interface',
  Debug: 'Debug',
} as const;
export type KeyOfScene = keyof typeof Scene;
export type TypeOfScene = (typeof Scene)[KeyOfScene];

export const Shader = {
  Glow: 'Glow',
  Vignette: 'Vignette',
  Noise: 'Noise',
  SoftLight: 'Soft Light',
  AntiAlias: 'Anti-alias',
} as const;
export type KeyOfShader = keyof typeof Shader;
export type TypeOfShader = (typeof Shader)[KeyOfShader];

export const Tilemap = {
  Test: 'tilemaps/test.json',
  SpringJetty: 'tilemaps/spring_jetty_area.json',
} as const;
export type KeyOfTilemap = keyof typeof Tilemap;
export type TypeOfTilemap = (typeof Tilemap)[KeyOfTilemap];

export const Tileset = {
  Snow: 'tilemaps/snow.png',
} as const;
export type KeyOfTileset = keyof typeof Tileset;
export type TypeOfTileset = (typeof Tileset)[KeyOfTileset];

export const Sprite = {
  Black1px: 'sprites/black_pixel.png',
  White1px: 'sprites/white_pixel.png',
  DebugPlayer: 'sprites/debug_player.png',
  ZButton: 'sprites/z_button.png',
  DownArrow: 'sprites/down_arrow.png',
  PlayerIdle: 'sprites/player/player_idle.png',
  PlayerSleep: 'sprites/player/player_sleep.png',
  PlayerWater: 'sprites/player/player_water.png',
  PlayerWave: 'sprites/player/player_wave.png',
  Snow1: 'sprites/snow/snow_1.png',
  Snow2: 'sprites/snow/snow_2.png',
  Snow3: 'sprites/snow/snow_3.png',
  Snow4: 'sprites/snow/snow_4.png',
  MainPlant: 'sprites/plants/main_plant.png',
  DeadPlant1: 'sprites/plants/dead_plant_1.png',
  DeadPlant2: 'sprites/plants/dead_plant_2.png',
  DeadPlant3: 'sprites/plants/dead_plant_3.png',
  SpringIcon: 'sprites/spring_icon.png',
  Jetty: 'sprites/jetty.png',
  DialogBox: 'sprites/dialog_box.png',
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
} as const;
export type KeyOfAnimation = keyof typeof Animation;
export type TypeOfAnimation = (typeof Animation)[KeyOfAnimation];

export const CollisionTag = {
  Player: 'player',
} as const;
export type KeyOfCollisionTag = keyof typeof CollisionTag;
export type TypeOfCollisionTag = (typeof CollisionTag)[KeyOfCollisionTag];

export const CollisionMask = {
  Default: 0x1111,
} as const;
export type KeyOfCollisionMask = keyof typeof CollisionMask;
export type TYPE_OF_COLLISION_MASK = (typeof CollisionMask)[KeyOfCollisionMask];

export const GlobalScale = 1;

export const Flag = {
  SkipMainMenu: 'skip_main_menu',
} as const;
export type KeyOfFlag = keyof typeof Flag;
export type TypeOfFlag = (typeof Flag)[KeyOfFlag];

export const Sound = {
  Activate: 'audio/activate.mp3',
  Music: 'audio/music_mainloop.ogg',
} as const;
export type KeyOfSound = keyof typeof Sound;
export type TypeOfSound = (typeof Sound)[KeyOfSound];
