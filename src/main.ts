import * as Sentry from '@sentry/browser';
import 'phaser';
import { AutumnFlower } from 'scenes/autumn_flower';
import { AutumnIceCube } from 'scenes/autumn_ice_cube';
import { AutumnIceCubeWithSnowman } from 'scenes/autumn_ice_cube_with_snowman';
import { AutumnJetty } from 'scenes/autumn_jetty';
import { AutumnSnowman } from 'scenes/autumn_snowman';
import { AutumnTitle } from 'scenes/autumn_title';

import { Boot } from 'scenes/boot';
import { Debug } from 'scenes/debug';
import { DialogBox } from 'scenes/dialog_box';
import { MainMenu } from 'scenes/main_menu';
import { Preloader } from 'scenes/preloader';
import { SpringFlower } from 'scenes/spring_flower';
import { SpringIceCube } from 'scenes/spring_ice_cube';
import { SpringJetty } from 'scenes/spring_jetty';
import { SpringTitle } from 'scenes/spring_title';
import { SummerFlower } from 'scenes/summer_flower';
import { SummerIceCube } from 'scenes/summer_ice_cube';
import { SummerJetty } from 'scenes/summer_jetty';
import { SummerTitle } from 'scenes/summer_title';
import { WinterIceCube } from 'scenes/winter_ice_cube';
import { WinterTitle } from 'scenes/winter_title';
import { setDebug } from 'systems/flags';

// @ts-expect-error Injected environment variable.
setDebug(true); // process.env.PHASER_DEBUG === 'true');

// @ts-expect-error Injected environment variable.
if (process.env.PHASER_SENTRY_DSN) {
  Sentry.init({
    // @ts-expect-error Injected environment variable.
    dsn: process.env.PHASER_SENTRY_DSN,
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.consoleLoggingIntegration({ levels: ['info', 'warn', 'error'] }),
      Sentry.replayIntegration(),
      Sentry.replayCanvasIntegration(),
    ],
    // @ts-expect-error Injected environment variable.
    release: process.env.GIT_SHA,
    // @ts-expect-error Injected environment variable.
    environment: process.env.PHASER_ENVIRONMENT,
    tracesSampleRate: 1.0,
    enableLogs: true,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  });
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  parent: 'game-container',
  backgroundColor: '#000000',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    gamepad: true,
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    Debug,
    SpringTitle,
    SpringJetty,
    DialogBox,
    SpringIceCube,
    SpringFlower,
    SummerTitle,
    SummerJetty,
    SummerIceCube,
    SummerFlower,
    AutumnTitle,
    AutumnJetty,
    AutumnIceCube,
    AutumnIceCubeWithSnowman,
    AutumnSnowman,
    AutumnFlower,
    WinterTitle,
    WinterIceCube,
  ],
};

export default new Phaser.Game(config);
