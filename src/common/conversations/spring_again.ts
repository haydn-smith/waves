import { Dialog } from 'common/objects/dialog_box';
import { Animation } from 'constants';

export const snowmanLeaves1: Dialog = [
  {
    image: Animation.SnowmanDialog,
    line1: ['Well then kiddo...'],
    line2: ['...My friend.'],
  },
  {
    image: Animation.SnowmanDialog,
    line1: ["It seems it's that time once more..."],
    line2: ['...Time to leave, ', 'for now.'],
  },
  {
    image: Animation.SnowmanDialog,
    line1: ['I must say though, it has indeed been'],
    line2: ['a good time!'],
    autoPlaySecondLine: true,
  },
];

export const snowmanLeaves2 = [
  {
    image: Animation.SnowmanDialog,
    line1: ['...'],
    line2: ["See ya round, ol' chap."],
  },
];

export const iceCubeLeaves1: Dialog = [
  {
    image: Animation.IceCubeDialog,
    line1: ['Hiya!'],
    line2: ['You know...'],
  },
  {
    image: Animation.IceCubeDialog,
    line1: ["I don't think I want to melt away"],
    line2: ['this year too.'],
    autoPlaySecondLine: true,
  },
  {
    image: Animation.IceCubeDialog,
    line1: ['So... ', 'Sooooooo...'],
    line2: ["...I'm going to have to leave!"],
  },
  {
    image: Animation.IceCubeDialog,
    line1: ['Off I go! In search of'],
    line2: ['cooler water!'],
    autoPlaySecondLine: true,
  },
  {
    image: Animation.IceCubeDialog,
    line1: ["I'll always remember this time we "],
    line2: ['spent hanging out here.'],
    autoPlaySecondLine: true,
  },
];

export const iceCubeLeaves2 = [
  {
    image: Animation.IceCubeDialog,
    line1: ['Hey!'],
    line2: ["Stay cool while I'm gone!"],
  },
];

export const snowBarrier1 = [
  {
    image: Animation.ThinkingDialog,
    line1: ['...'],
    line2: ["There's no way to get through."],
  },
  {
    image: Animation.ThinkingDialog,
    line1: ['This time...'],
    line2: ['...not even magic can help.'],
  },
];

export const snowBarrier2 = [
  {
    image: Animation.ThinkingDialog,
    line1: ['...'],
    line2: ['You wonder if the little plant is doing okay.'],
  },
];

export const playerLeaves = [
  {
    image: Animation.ThinkingDialog,
    line1: ['...'],
    line2: ['It seems your time here is done.'],
  },
  {
    image: Animation.ThinkingDialog,
    line1: ['...'],
    line2: ['The next adventure awaits.'],
  },
];
