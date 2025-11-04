import * as Sentry from '@sentry/browser';
import 'phaser';

import { Boot } from 'scenes/boot';
import { Debug } from 'scenes/debug';
import { MainMenu } from 'scenes/main_menu';
import { Preloader } from 'scenes/preloader';
import { SpringJetty } from 'scenes/spring_jetty';
import { SpringTitle } from 'scenes/spring_title';
import { setDebug } from 'systems/flags';

// @ts-expect-error Injected environment variable.
setDebug(false); // process.env.PHASER_DEBUG === 'true');

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
  scene: [Boot, Preloader, MainMenu, Debug, SpringTitle, SpringJetty],
};

export default new Phaser.Game(config);
