import { Shader } from 'constants';

const fragShader = `
#define SHADER_NAME SOFTLIGHT_FS

precision mediump float;

uniform vec2      uTextureSize;
uniform sampler2D uMainSampler;
varying vec2      outTexCoord;
uniform float     uProgress;

uniform float uTime;

float random (vec2 uv)
{
    return fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
  vec4 color = texture2D(uMainSampler, outTexCoord);

  vec2 uv = gl_FragCoord.xy / uTextureSize.xy;

  vec2 pos = gl_FragCoord.xy;

  if (uProgress == 1.0) {
      gl_FragColor = vec4(0,0,0,1);
  }

else if (uProgress > 0.0 && mod(pos.x, 4.0) < 2.0 && mod(pos.y, 4.0) < 2.0) {
      gl_FragColor = vec4(0,0,0,1);
  }

else if (uProgress > 0.25 && mod(pos.x + 2.0, 4.0) < 2.0 && mod(pos.y + 2.0, 4.0) < 2.0) {
      gl_FragColor = vec4(0,0,0,1);
  }

else if (uProgress > 0.5 && mod(pos.x, 6.0) < 2.0 && mod(pos.y, 6.0) < 2.0) {
      gl_FragColor = vec4(0,0,0,1);
  }

else if (uProgress > 0.75 && mod(pos.x + 2.0, 6.0) < 2.0 && mod(pos.y + 2.0, 6.0) < 2.0) {
      gl_FragColor = vec4(0,0,0,1);
  }

else {
    gl_FragColor = color;
}
}
`;

export class Fade extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  public progress: number = 0;

  constructor(game: Phaser.Game) {
    super({
      name: Shader.Noise,
      game,
      renderTarget: true,
      fragShader,
    });
  }

  onPreRender(): void {
    this.set2f('uTextureSize', this.renderer.width, this.renderer.height);
    this.set1f('uTime', this.game.loop.time);
    this.set1f('uProgress', this.progress);
  }
}
