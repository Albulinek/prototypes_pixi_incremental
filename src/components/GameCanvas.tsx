import { Application, extend } from '@pixi/react';
import { Container, Graphics, Text, FederatedPointerEvent, Rectangle } from 'pixi.js';
import { useGameStore } from '../store/useGameStore';
import { BuildingType } from '../types';

// Extend pixi-react with the components we want to use
extend({ Container, Graphics, Text });

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
          {grid.flat().map((cell) =>
            cell.building ? (
              <pixiGraphics
                key={cell.building.id}
                draw={(g) => {
                  const color = cell.building?.type === BuildingType.BASE ? 0x00ff00 : 0xff0000;
                  g.fill(color);
                  g.rect(cell.position.x * CELL_SIZE + 2, cell.position.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                }}
              />
            ) : null
          )}
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