import { Dialog } from 'common/objects/dialog_box';
import { Animation, Sound } from 'constants';

export const fallLeaves1 = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['Much of the snow has melted after summer...'],
    line2: ['Leaving behind a bed of leaves.'],
  },
];

export const fallLeaves2 = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['These leaves...'],
    line2: ['Evidence a plant can survive...'],
  },
];

export const iceCubeThanks: Dialog = [
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['Yo! ', 'Hey! ', '...'],
    line2: ['Thanks for the help back in summer.'],
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['I really was worried I would'],
    line2: ['overheat!'],
    autoPlaySecondLine: true,
  },
];

export const iceCubeSnowBarrier = [
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['Seems like a new snow wall has formed.'],
    line2: ['...'],
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['Sorry, ', "I can't help!"],
    line2: ['My specialty is "ice" walls!'],
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['...'],
    line2: ['Not "snow" walls!'],
  },
];

export const snowBarrier = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['Snow is in the way again.'],
    line2: [],
  },
];

export const snowmanNoSnow = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['... ', 'Oh dear.'],
    line2: ['I seem to be in a spot of bother.'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['Do you think... ', 'Perchance...'],
    line2: ['You could help me out?'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['I seem to have run out of snow.'],
    line2: ['Can you find me some?'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['...'],
    line2: ['Jolly good, then!'],
  },
];

export const snowmanNoSnow2 = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['Push me some snow, kiddo!'],
    line2: [],
  },
];

export const snowmanWithOneSnow = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['...Ah!'],
    line2: ["Thank you for the snow ol' chap!"],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['But I will be needing bit more than that!'],
    line2: [],
  },
];

export const snowmanWithTwoSnow = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['...Splendid!'],
    line2: ['Even more snow!'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['But I will be needing bit more than that!'],
    line2: [],
  },
];

export const snowmanWithThreeSnow = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['...Perfect!'],
    line2: ['Snow!'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['I am complete!'],
    line2: [],
  },
];

export const completeSnowman = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['Aha!'],
    line2: ['As you can see...'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['I am a majestic, magical snowman.'],
    line2: ['And also did I mention...'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['I have magical snow magic!'],
    line2: [],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['For example...'],
    line2: ['Come this way and watch!'],
  },
];

export const iceCubeAboutSnowmanAndPlant = [
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['Yoooo!'],
    line2: ['How cool was that!'],
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['...'],
    line2: ['Hey...'],
  },
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['I hope your little plant is alright.'],
    line2: [],
  },
];

export const iceCubeAboutPlant = [
  {
    image: Animation.IceCubeDialog,
    sound: [Sound.IceCube1, Sound.IceCube2],
    line1: ['I hope your little plant is alright.'],
    line2: [],
  },
];

export const snowmanAfterLifingBarrier1: Dialog = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['See! There you go! ', 'Magic!'],
    line2: ['...'],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ["Listen ol' chap, ", 'winter is coming up'],
    line2: ['quite soon...'],
    autoPlaySecondLine: true,
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['...And it can get rough.'],
    line2: [],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['You need to be prepared for the worst.'],
    line2: [],
  },
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['All the same...'],
    line2: ['Thank you for helping me out!'],
  },
];

export const snowmanAfterLifingBarrier2 = [
  {
    image: Animation.SnowmanDialog,
    sound: [Sound.Snowman1, Sound.Snowman2],
    line1: ['Thank you for helping me out!'],
    line2: [],
  },
];

export const autumnFlower = [
  {
    image: Animation.ThinkingDialog,
    sound: [Sound.Purple1, Sound.Purple2],
    line1: ['...'],
    line2: ['Still hanging in there.'],
  },
];
