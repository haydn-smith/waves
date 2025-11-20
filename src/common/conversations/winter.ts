import { Dialog } from 'common/objects/dialog_box';
import { Animation } from 'constants';

export const iceCubeWinter1 = [
  {
    image: Animation.ThinkingDialog,
    line1: ['... ', '... ', '...'],
    line2: ['The ice cube is completely frozen.'],
  },
];

export const iceCubeWinter2 = [
  {
    image: Animation.ThinkingDialog,
    line1: ['... ', '...'],
    line2: ['Yep. ', 'Still frozen.'],
  },
];

export const iceCubeWinter3 = [
  {
    image: Animation.ThinkingDialog,
    line1: ['...'],
    line2: ["They'll be alright... "],
  },
  {
    image: Animation.ThinkingDialog,
    line1: ["They're literally an ice cube."],
    line2: ['...'],
  },
];

export const snowmanWinter1 = [
  {
    image: Animation.SnowmanDialog,
    line1: ['By golly! ', 'This storm is crazy!'],
    line2: ["It's blown away my body!"],
  },
  {
    image: Animation.SnowmanDialog,
    line1: ["It's quite alright though..."],
    line2: ['I sure do like all this snow!'],
  },
  {
    image: Animation.SnowmanDialog,
    line1: ['Say pal...'],
    line2: ['I hope your little plant is okay.'],
  },
];

export const snowmanWinter2: Dialog = [
  {
    image: Animation.SnowmanDialog,
    line1: ['Say pal...'],
    line2: ['I hope your little plant is okay.'],
  },
];

export const checkOnPlant: Dialog = [
  {
    image: Animation.ThinkingDialog,
    line1: ['You need to get to the little plant.'],
    line2: ['This storm could be dangerous.'],
  },
];
