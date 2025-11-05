import { Dialog } from 'common/objects/dialog_box';
import { Sprite } from 'constants';

export const otherPenguinHello = [
  {
    image: Sprite.PlayerIdle,
    line1: ['Oh...', 'Hi!'],
    line2: ["It's that time of year, you know?"],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['Time to migrate!'],
    line2: ['The fishies wont eat themselves!'],
  },
];

export const otherPenguinGoodbye = [
  {
    image: Sprite.PlayerIdle,
    line1: ['...'],
    line2: [],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ["You're that one pengiun, aren't you?"],
    line2: [],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['...'],
    line2: [],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['The penguin with one more thing left to do here.'],
    line2: [],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['What can one pengiun do...'],
    line2: ['Against the adversities of the antarctic?'],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['...'],
    line2: ['Oh well!'],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['Good luck!'],
    line2: [],
  },
];

export const iceCube1: Dialog = [
  {
    image: Sprite.PlayerIdle,
    line1: ['This ice cube seems to have frozen in a prefect cube.'],
    line2: ['...'],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ["It's..."],
    line2: ['... an ice cube.'],
  },
];

export const iceCube2: Dialog = [
  {
    image: Sprite.PlayerIdle,
    line1: ["This ice cube looks like it's been"],
    line2: ['frozen here for a while.'],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['Perhaps the warmer months will free'],
    line2: ['it up a bit!'],
  },
];

export const iceCube3: Dialog = [
  {
    image: Sprite.PlayerIdle,
    line1: ['Yep.'],
    line2: ["It's still a very frozen ice cube."],
  },
];

export const snowCaveIn1: Dialog = [
  {
    image: Sprite.PlayerIdle,
    line1: ['The snow appears to have caved in here.'],
    line2: ['...'],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['Maybe the warmer months will clear the snow.'],
    line2: ['...'],
  },
];

export const springFlower: Dialog = [
  {
    image: Sprite.PlayerIdle,
    line1: ['This plant ', '...'],
    line2: ['...', 'is still alive.'],
  },
  {
    image: Sprite.PlayerIdle,
    line1: ['... ', 'Just barely.'],
    line2: ['It looks like it needs some water.'],
  },
];
