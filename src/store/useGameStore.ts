import { create } from 'zustand';
import { type GameState, BuildingType, type GridCell, type GridPosition } from '../types';

export const BUILDING_COSTS = {
  [BuildingType.MINER]: { stone: 100 },
  [BuildingType.BASE]: { stone: 0 },
  [BuildingType.TUNNEL]: { stone: 10 },
  [BuildingType.REFINERY]: { stone: 150 },
} as const;

const GRID_SIZE = 20;

const getInitialState = (): GameState => {
  const grid = Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x): GridCell => ({
      position: { x, y },
    }))
  );
  return { grid, resources: { stone: 500, iron: 0, gold: 0 }, debug: { enabled: true } };
};

interface GameActions {
  gameTick: () => void;
  addStone: (amount: number) => void;
  toggleDebug: () => void;
  placeBuilding: (position: GridPosition, type: BuildingType) => boolean;
  reset: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...getInitialState(),
  
  gameTick: () => {
    set((state) => {
      return { ...state };
    });
  },

  addStone: (amount) => {
    set((state) => ({
      resources: { ...state.resources, stone: state.resources.stone + amount },
    }));
  },

  toggleDebug: () => {
    set((state) => ({ debug: { enabled: !state.debug.enabled } }));
  },

  reset: () => {
    set(getInitialState());
  },

  placeBuilding: (position, type) => {
    const state = get();
    const cost = BUILDING_COSTS[type].stone;
    const targetCell = state.grid[position.y][position.x];

    if (targetCell.building) return false;
    if (state.resources.stone < cost) return false;

    set((prevState) => {
      const newGrid = prevState.grid.map(row => [...row]);
      newGrid[position.y][position.x].building = {
        id: `${type}-${position.x}-${position.y}`,
        type: type,
        position: position,
        level: 1,
        connections: [],
      };
      return {
        grid: newGrid,
        resources: {
          ...prevState.resources,
          stone: prevState.resources.stone - cost,
        },
      };
    });
    
    return true;
  },
}));