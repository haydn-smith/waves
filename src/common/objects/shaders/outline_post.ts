import { Shader } from 'constants';

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
varying vec2 outTexCoord;

void main()
{
    vec4 pixel = texture2D(uMainSampler, outTexCoord);

    vec4 pixelUp = texture2D(uMainSampler, outTexCoord + (vec2(0, 1) / uResolution));
    vec4 pixelDown = texture2D(uMainSampler, outTexCoord + (vec2(0, -1) / uResolution));
    vec4 pixelLeft = texture2D(uMainSampler, outTexCoord + (vec2(-1, 0) / uResolution));
    vec4 pixelRight = texture2D(uMainSampler, outTexCoord + (vec2(1, 0) / uResolution));

    if (pixel.a == 0.0 && (pixelUp.a > 0.0 || pixelDown.a > 0.0 || pixelLeft.a > 0.0 || pixelRight.a > 0.0)) {
        gl_FragColor = vec4(0,0,0,1);
    } else {
        gl_FragColor = pixel;
    }
}
`;

export class OutlinePost extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      name: Shader.Outline,
      game,
      fragShader,
    });
  }

  onPreRender() {
    this.set2f('uResolution', this.renderer.width, this.renderer.height);
  }
}
