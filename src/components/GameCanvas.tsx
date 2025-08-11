import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { useGameStore } from '../store/useGameStore';
import { BuildingType } from '../types';

const GRID_SIZE = 20;
const CELL_SIZE = 40;
const MAP_SIZE = GRID_SIZE * CELL_SIZE;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixiApp = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    const initPixi = async () => {
      if (canvasRef.current && !pixiApp.current) {
        const app = new PIXI.Application();
        await app.init({
          canvas: canvasRef.current,
          width: MAP_SIZE,
          height: MAP_SIZE,
          backgroundColor: 0x1a1a1a,
        });
        pixiApp.current = app;

        const graphics = new PIXI.Graphics();
        app.stage.addChild(graphics);

        app.ticker.add(() => {
          graphics.clear();
          const { grid, debug } = useGameStore.getState();

          graphics.stroke({ width: 1, color: 0x333333 });
          for (let i = 0; i <= GRID_SIZE; i++) {
            graphics.moveTo(i * CELL_SIZE, 0).lineTo(i * CELL_SIZE, MAP_SIZE);
            graphics.moveTo(0, i * CELL_SIZE).lineTo(MAP_SIZE, i * CELL_SIZE);
          }

          for (const row of grid) {
            for (const cell of row) {
              if (cell.building) {
                const color = cell.building.type === BuildingType.BASE ? 0x00ff00 : 0xff0000;
                graphics.fill(color);
                graphics.rect(cell.position.x * CELL_SIZE + 2, cell.position.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
              }
              if (debug.enabled) {
                const text = new PIXI.Text({
                  text: `${cell.position.x},${cell.position.y}`,
                  style: { fontFamily: 'Arial', fontSize: 10, fill: 0xaaaaaa },
                });
                text.x = cell.position.x * CELL_SIZE + 2;
                text.y = cell.position.y * CELL_SIZE + 2;
                graphics.addChild(text);
              }
            }
          }
          if (debug.enabled) {
            graphics.removeChildren();
          }
        });
      }
    };
    initPixi();

    return () => {
      pixiApp.current?.destroy(true);
      pixiApp.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} />;
}