import { Sound, TypeOfSound } from 'constants';

type Sound = Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;

export function getWindAudio(scene: Phaser.Scene) {
  let sound = scene.sound.get(Sound.Wind);

  if (!sound) {
    sound = scene.sound.add(Sound.Wind, { loop: true, volume: 0.1 });
  }

  return sound as Sound;
}

export function getAudioSingleton(scene: Phaser.Scene, key: TypeOfSound) {
  let sound = scene.sound.get(key);

  if (!sound) {
    sound = scene.sound.add(key, { loop: true, volume: 1 });
  }

  return sound as Sound;
}

export function fadeAudioVolume(scene: Phaser.Scene, sound: Sound, to: number, duration: number = 3000) {
  scene.tweens
    .add({
      targets: sound,
      props: {
        volume: { from: sound.volume, to },
      },
      duration,
      onUpdate: (_tween, _target, _key, current) => {
        sound.setVolume(current);
      },
    })
    .play();
}
