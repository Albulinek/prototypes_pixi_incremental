import { Application, extend } from '@pixi/react';
import { Container, Graphics, Text, FederatedPointerEvent, Rectangle, Sprite } from 'pixi.js';
import { useGameStore } from '../store/useGameStore';
import { BuildingType } from '../types';
import { Miner } from './Miner';

// Extend pixi-react with the components we want to use
extend({ Container, Graphics, Text, Sprite });

const GRID_SIZE = 20;
const CELL_SIZE = 40;
const MAP_SIZE = GRID_SIZE * CELL_SIZE;

export function GameCanvas() {
  const { grid, debug, selectedBuildingType, placeBuilding } = useGameStore();

  const pointerDownHandler = (event: FederatedPointerEvent) => {
    const pos = event.global;
    const gridX = Math.floor(pos.x / CELL_SIZE);
    const gridY = Math.floor(pos.y / CELL_SIZE);
    if (selectedBuildingType) {
      placeBuilding({ x: gridX, y: gridY }, selectedBuildingType);
    }
  };

  return (
    <Application width={MAP_SIZE} height={MAP_SIZE} backgroundColor={0x1a1a1a}>
      <pixiContainer
        eventMode={'static'}
        hitArea={new Rectangle(0, 0, MAP_SIZE, MAP_SIZE)}
        onPointerDown={pointerDownHandler}
      >
        {/* Grid Lines */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.stroke({ width: 1, color: 0x333333 });
            for (let i = 0; i <= GRID_SIZE; i++) {
              g.moveTo(i * CELL_SIZE, 0).lineTo(i * CELL_SIZE, MAP_SIZE);
              g.moveTo(0, i * CELL_SIZE).lineTo(MAP_SIZE, i * CELL_SIZE);
            }
          }}
        />

        {/* Buildings */}
        <pixiContainer>
          {grid.flat().map((cell) => {
            if (!cell.building) return null;

            const buildingX = cell.position.x * CELL_SIZE;
            const buildingY = cell.position.y * CELL_SIZE;

            switch (cell.building.type) {
              case BuildingType.MINER:
                return <Miner key={cell.building.id} x={buildingX} y={buildingY} />;
              case BuildingType.BASE:
              case BuildingType.TUNNEL:
                return (
                  <pixiGraphics
                    key={cell.building.id}
                    draw={(g) => {
                      const color = cell.building?.type === BuildingType.BASE ? 0x00ff00 : 0x808080;
                      g.fill(color);
                      g.rect(buildingX + 2, buildingY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                    }}
                  />
                );
              default:
                return null;
            }
          })}
        </pixiContainer>

        {/* Debug Text */}
        {debug.enabled && (
          <pixiContainer>
            {grid.flat().map((cell) => (
              <pixiText
                key={`debug-${cell.position.x}-${cell.position.y}`}
                text={`${cell.position.x},${cell.position.y}`}
                style={{ fontFamily: 'Arial', fontSize: 10, fill: 0xaaaaaa }}
                x={cell.position.x * CELL_SIZE + 2}
                y={cell.position.y * CELL_SIZE + 2}
              />
            ))}
          </pixiContainer>
        )}
      </pixiContainer>
    </Application>
  );
}
