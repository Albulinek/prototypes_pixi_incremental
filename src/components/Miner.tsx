import { useTick } from '@pixi/react';
import { Texture, Point, Sprite, Filter, Assets, GlProgram } from 'pixi.js';
import { useMemo, useRef } from 'react';
import { useGameStore, CYCLE_DURATION } from '../store/useGameStore';

const MAP_SIZE = 800; // Same as in GameCanvas
const CELL_SIZE = 40;

// --- Custom Normal Map Filter ---
// This is the CORRECT vertex shader for PixiJS v8 filters.
const vertexShader = `
    in vec2 aPosition;
    out vec2 vTextureCoord;

    uniform vec4 uInputSize;
    uniform vec4 uOutputFrame;

    void main(void)
    {
        vTextureCoord = aPosition * uInputSize.xy / uOutputFrame.zw;
        gl_Position = vec4((aPosition * uOutputFrame.zw) + uOutputFrame.xy, 0.0, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler; // Represents the original sprite texture
    uniform sampler2D uNormalMap;
    
    uniform vec2 uLightPosition;

    void main(void)
    {
        vec4 normalColor = texture2D(uNormalMap, vTextureCoord);
        vec3 normal = normalize(normalColor.rgb * 2.0 - 1.0);

        // We use gl_FragCoord to get the pixel's position on the screen
        vec2 lightDirection = normalize(uLightPosition - gl_FragCoord.xy);
        
        float light = dot(normal.xy, lightDirection);
        light = clamp(light, 0.3, 1.0); // Ambient light set to 0.3

        vec4 color = texture2D(uSampler, vTextureCoord);
        gl_FragColor = vec4(color.rgb * light, color.a);
    }
`;

class CustomNormalMapFilter extends Filter {
  constructor(normalMap: Texture) {
    const glProgram = new GlProgram({
        vertex: vertexShader,
        fragment: fragmentShader,
    });

    super({
        glProgram,
        resources: {
            uNormalMap: normalMap,
            lightUniforms: {
                uLightPosition: { value: new Point(), type: 'vec2<f32>' },
            },
        },
    });
  }
}
// --- End Custom Filter ---


interface MinerProps {
  x: number;
  y: number;
}

export function Miner({ x, y }: MinerProps) {
  const time = useGameStore((state) => state.time);
  const shadowRef = useRef<Sprite>(null);

  const { minerTexture, minerNormalMap } = useMemo(() => ({
    minerTexture: Assets.get('minerSprite'),
    minerNormalMap: Assets.get('minerNormal'),
  }), []);

  const normalFilter = useMemo(() => {
      return new CustomNormalMapFilter(minerNormalMap);
  }, [minerNormalMap]);

  useTick(() => {
    const angle = (time / CYCLE_DURATION) * Math.PI * 2;
    const radius = MAP_SIZE / 1.5;
    const lightX = x + (CELL_SIZE / 2) + Math.cos(angle) * radius;
    const lightY = y + (CELL_SIZE / 2) + Math.sin(angle) * radius;

    const lightPositionUniform = normalFilter.resources.lightUniforms.uniforms.uLightPosition;
    if (lightPositionUniform) {
        lightPositionUniform.x = lightX;
        lightPositionUniform.y = lightY;
    }

    if (shadowRef.current) {
      const shadowAngle = angle + Math.PI;
      shadowRef.current.rotation = shadowAngle;
      const lightHeight = Math.abs(Math.sin(angle));
      const shadowLength = (1 - lightHeight) * 0.5 + 0.2;
      shadowRef.current.scale.y = shadowLength;
    }
  });

  return (
    <>
      <pixiSprite
        ref={shadowRef}
        texture={minerTexture}
        x={x + CELL_SIZE / 2}
        y={y + CELL_SIZE / 2}
        width={CELL_SIZE}
        height={CELL_SIZE}
        anchor={0.5}
        tint={0x000000}
        alpha={0.4}
      />
      <pixiSprite
        texture={minerTexture}
        x={x}
        y={y}
        width={CELL_SIZE}
        height={CELL_SIZE}
        filters={[normalFilter]}
      />
    </>
  );
}
