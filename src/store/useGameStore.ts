import { create } from 'zustand';
import { type GameState, BuildingType, type GridCell, type GridPosition } from '../types';

export const BUILDING_COSTS = {
  [BuildingType.MINER]: { stone: 100 },
  [BuildingType.BASE]: { stone: 0 },
  [BuildingType.TUNNEL]: { stone: 10 },
  [BuildingType.REFINERY]: { stone: 150 },
} as const;

const GRID_SIZE = 20;
const DAY_DURATION = 60; // 60 ticks = 1 minute
const NIGHT_DURATION = 60; // 60 ticks = 1 minute
export const CYCLE_DURATION = DAY_DURATION + NIGHT_DURATION;


const getInitialState = (): GameState => {
  const grid = Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x): GridCell => ({
      position: { x, y },
    }))
  );
  return { 
    grid, 
    resources: { stone: 500, iron: 0, gold: 0 }, 
    debug: { enabled: true }, 
    log: [], 
    selectedBuildingType: BuildingType.MINER, 
    productionBuildings: {},
    time: 0,
  };
};

interface GameActions {
  gameTick: () => void;
  addStone: (amount: number) => void;
  toggleDebug: () => void;
  placeBuilding: (position: GridPosition, type: BuildingType) => boolean;
  setSelectedBuildingType: (type: BuildingType | null) => void;
  logMessage: (message: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...getInitialState(),
  
  logMessage: (message) => {
    set((state) => ({
      log: [`[${new Date().toLocaleTimeString()}] ${message}`, ...state.log.slice(0, 100)]
    }));
  },

  placeBuilding: (position, type) => {
    const state = get();
    if (!position || type === null) return false;
    
    const cost = BUILDING_COSTS[type].stone;
    const targetCell = state.grid[position.y][position.x];

    if (targetCell.building) {
      state.logMessage(`Placement failed: Cell (${position.x}, ${position.y}) is occupied.`);
      return false;
    }
    if (state.resources.stone < cost) {
      state.logMessage(`Placement failed: Insufficient stone. Need ${cost}, have ${state.resources.stone}.`);
      return false;
    }

    state.logMessage(`Placed ${type} at (${position.x}, ${position.y}).`);
    set((prevState) => {
      const newGrid = prevState.grid.map(row => [...row]);
      const buildingId = `${type}-${position.x}-${position.y}`;
      newGrid[position.y][position.x].building = {
        id: buildingId,
        type: type,
        position: position,
        level: 1,
        connections: [],
      };
      
      const newProductionBuildings = { ...prevState.productionBuildings };
      if (type === BuildingType.MINER) {
        newProductionBuildings[buildingId] = position;
      }
      
      return {
        grid: newGrid,
        productionBuildings: newProductionBuildings,
        resources: {
          ...prevState.resources,
          stone: prevState.resources.stone - cost,
        },
      };
    });
    
    return true;
  },

  gameTick: () => set((state) => {
    let stoneProduced = 0;
    for (const pos of Object.values(state.productionBuildings)) {
      const building = state.grid[pos.y][pos.x].building;
      if (building) {
        stoneProduced += building.level;
      }
    }

    const newTime = (state.time + 1) % CYCLE_DURATION;
    
    return { 
      resources: { 
        ...state.resources, 
        stone: state.resources.stone + stoneProduced 
      },
      time: newTime,
    };
  }),

  addStone: (amount) => set((state) => ({
    resources: { ...state.resources, stone: state.resources.stone + amount },
  })),

  toggleDebug: () => set((state) => ({ debug: { enabled: !state.debug.enabled } })),

  setSelectedBuildingType: (type) => set({ selectedBuildingType: type }),

  reset: () => set(getInitialState()),
}));
