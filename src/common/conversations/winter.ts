import { Dialog } from 'common/objects/dialog_box';
import { Animation } from 'constants';

export const iceCubeWinter1 = [
  {
    image: Animation.ThinkingDialog,
    line1: ['...', '...', '...'],
    line2: ['The ice cube is completely frozen.'],
  },
];

export const iceCubeWinter2 = [
  {
    image: Animation.ThinkingDialog,
    line1: ['...', '...'],
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
    line2: ['...'],
  },
  {
    image: Animation.SnowmanDialog,
    line1: ['I sure do like all this snow though!'],
    line2: ['...'],
  },
];

export const snowmanWinter2: Dialog = [
  {
    image: Animation.SnowmanDialog,
    line1: ['Say pal...', 'Do you think our little'],
    line2: ['plant field is okay?'],
    autoPlaySecondLine: true,
  },
];

export const checkOnPlant: Dialog = [
  {
    image: Animation.ThinkingDialog,
    line1: ['You need to get to the little plant.'],
    line2: ['This storm could be dangerous.'],
  },
];
