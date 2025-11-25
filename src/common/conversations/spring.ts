import { Dialog } from 'common/objects/dialog_box';
import { Animation, Sound } from 'constants';

export const otherPenguinHello = [
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ['Oh... ', 'Hi!'],
    line2: ["It's that time of year, you know?"],
  },
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ['Time to migrate!'],
    line2: ['The fishies wont eat themselves!'],
  },
];

export const otherPenguinGoodbye = [
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ['...'],
    line2: [],
  },
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ["You're that one pengiun."],
    line2: [],
  },
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ['...'],
    line2: [],
  },
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ["You're going to stay behind, aren't you?"],
    line2: [],
  },
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ['What can one small pengiun do...'],
    line2: ['Against the adversities of the antarctic?'],
  },
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ['...'],
    line2: ['Oh well! ', 'Whatever it is...'],
  },
  {
    image: Animation.OtherPenguinDialog,
    sound: [Sound.Penguin1, Sound.Penguin2],
    line1: ['...Good luck!'],
    line2: [],
  },
];

export const iceCube1: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['This ice cube seems to have frozen in a'],
    line2: ['prefect cube'],
    autoPlaySecondLine: true,
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ["It's..."],
    line2: ['...An ice cube.'],
  },
];

export const iceCube2: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ["This ice cube looks like it's been"],
    line2: ['frozen here for a while.'],
    autoPlaySecondLine: true,
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['Perhaps the warmer months will free'],
    line2: ['it up a bit!'],
    autoPlaySecondLine: true,
  },
];

export const iceCube3: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['Yep.'],
    line2: ["It's still a very frozen ice cube."],
  },
];

export const snowCaveIn1: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['The snow appears to have caved in here.'],
    line2: ['...'],
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['Maybe the warmer months will clear the snow.'],
    line2: ['...'],
  },
];

export const snowCaveIn2: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['...'],
    line2: ["There's too much snow in the way!"],
  },
];

export const springFlower: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['This plant ', '...'],
    line2: ['... ', 'is still alive.'],
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['... ', 'Just barely.'],
    line2: ['It looks like it needs some water.'],
  },
];

export const deadFlower1_1: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['This plant ', '...'],
    line2: ['Has passed away.'],
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['...'],
    line2: [],
  },
];

export const deadFlower1_2: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ["These plants can't stand the adversities"],
    line2: ['of winter alone.'],
    autoPlaySecondLine: true,
  },
];

export const deadFlower2_1: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['This plant ', '...'],
    line2: ["Didn't make it."],
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['...'],
    line2: [],
  },
];

export const deadFlower2_2: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ["These plants can't stand the adversities"],
    line2: ['of winter alone.'],
    autoPlaySecondLine: true,
  },
];

export const deadFlower3_1: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['This plant ', '...'],
    line2: ['...'],
  },
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['...'],
    line2: [],
  },
];

export const deadFlower3_2: Dialog = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ["These plants can't stand the adversities"],
    line2: ['of winter alone.'],
    autoPlaySecondLine: true,
  },
];
