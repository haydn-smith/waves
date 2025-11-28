import { Dialog } from 'common/objects/dialog_box';
import { Animation, Sound } from 'constants';

export const snowmanLeaves1: Dialog = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['Well then kiddo...'],
    line2: ['My friend.'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ["It seems it's that time once more..."],
    line2: ['Time to leave, ', 'for now.'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['I must say though, it has indeed been'],
    line2: ['a good time.'],
    autoPlaySecondLine: true,
  },
];

export const snowmanLeaves2 = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ["I'll see you around, ol' chap."],
    line2: [],
  },
];

export const iceCubeLeaves1: Dialog = [
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['Hi!'],
    line2: ['You know...'],
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ["I don't think I want to melt away"],
    line2: ['this year too.'],
    autoPlaySecondLine: true,
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['So... ', 'Sooooooo...'],
    line2: ["...I'm going to have to leave!"],
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['Off I go! In search of'],
    line2: ['cooler water!'],
    autoPlaySecondLine: true,
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ["I'll always remember this time we "],
    line2: ['spent hanging out here.'],
    autoPlaySecondLine: true,
  },
];

export const iceCubeLeaves2 = [
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['Hey!'],
    line2: ['Stay cool... ', "And I'll see you again soon!"],
  },
];

export const snowBarrier1 = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ["There's no way to get through."],
    line2: ['...'],
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['This time...'],
    line2: ['Not even magic can help.'],
  },
];

export const snowBarrier2 = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['You wonder if the little plant is doing okay.'],
    line2: [],
  },
];

export const playerLeaves: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['It seems your time here is done.'],
    line2: ['...'],
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['Making waves...'],
    line2: ['With every small action you take.'],
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['...'],
    line2: ['The next adventure awaits.'],
  },
];
