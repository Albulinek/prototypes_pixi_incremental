import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { useGameStore } from '../store/useGameStore';
import { BuildingType } from '../types';

const GRID_SIZE = 20;
const CELL_SIZE = 40;
const MAP_SIZE = GRID_SIZE * CELL_SIZE;

function syncCanvasWithState(buildingContainer: PIXI.Container, debugContainer: PIXI.Container) {
  const { grid, debug } = useGameStore.getState();

  buildingContainer.removeChildren();
  debugContainer.removeChildren();

  for (const row of grid) {
    for (const cell of row) {
      if (cell.building) {
        const buildingGraphic = new PIXI.Graphics();
        const color = cell.building.type === BuildingType.BASE ? 0x00ff00 : 0xff0000;
        buildingGraphic.fill(color);
        buildingGraphic.rect(cell.position.x * CELL_SIZE + 2, cell.position.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        buildingContainer.addChild(buildingGraphic);
      }
      if (debug.enabled) {
        const text = new PIXI.Text({
          text: `${cell.position.x},${cell.position.y}`,
          style: { fontFamily: 'Arial', fontSize: 10, fill: 0xaaaaaa },
        });
        text.x = cell.position.x * CELL_SIZE + 2;
        text.y = cell.position.y * CELL_SIZE + 2;
        debugContainer.addChild(text);
      }
    }
  }
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let unsubscribe: () => void;

    const app = new PIXI.Application();
    appRef.current = app;

    const pointerDownHandler = (event: PIXI.FederatedPointerEvent) => {
      const pos = event.global;
      const gridX = Math.floor(pos.x / CELL_SIZE);
      const gridY = Math.floor(pos.y / CELL_SIZE);
      const { selectedBuildingType, placeBuilding } = useGameStore.getState();
      if (selectedBuildingType) {
        placeBuilding({ x: gridX, y: gridY }, selectedBuildingType);
      }
    };

    const init = async () => {
      await app.init({
        canvas: canvasRef.current!,
        width: MAP_SIZE,
        height: MAP_SIZE,
        backgroundColor: 0x1a1a1a,
      });

      const gridLines = new PIXI.Graphics();
      const buildingContainer = new PIXI.Container();
      const debugContainer = new PIXI.Container();

      debugContainer.eventMode = 'none';

      app.stage.addChild(gridLines, buildingContainer, debugContainer);
      
      gridLines.stroke({ width: 1, color: 0x333333 });
      for (let i = 0; i <= GRID_SIZE; i++) {
        gridLines.moveTo(i * CELL_SIZE, 0).lineTo(i * CELL_SIZE, MAP_SIZE);
        gridLines.moveTo(0, i * CELL_SIZE).lineTo(MAP_SIZE, i * CELL_SIZE);
      }
      
      app.stage.eventMode = 'static';
      app.stage.hitArea = app.screen;
      app.stage.on('pointerdown', pointerDownHandler);

      syncCanvasWithState(buildingContainer, debugContainer);
      unsubscribe = useGameStore.subscribe(() => syncCanvasWithState(buildingContainer, debugContainer));
    };

    init();

    return () => {
      unsubscribe?.();
      if (appRef.current) {
        if(appRef.current.stage) {
            appRef.current.stage.off('pointerdown', pointerDownHandler);
        }
        appRef.current.destroy(true);
      }
      appRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} />;
}