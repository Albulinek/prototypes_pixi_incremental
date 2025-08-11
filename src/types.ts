export const BuildingType = {
  BASE: 'BASE',
  TUNNEL: 'TUNNEL',
  MINER: 'MINER',
  REFINERY: 'REFINERY',
} as const;

export type BuildingType = typeof BuildingType[keyof typeof BuildingType];

export interface GridPosition {
  x: number;
  y: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  position: GridPosition;
  level: number;
  connections: GridPosition[];
}

export interface GridCell {
  position: GridPosition;
  building?: Building;
}

export interface GameState {
  grid: GridCell[][];
  resources: {
    stone: number;
    iron: number;
    gold: number;
  };
  debug: {
    enabled: boolean;
  };
  log: string[];
  selectedBuildingType: BuildingType | null;
  productionBuildings: Record<string, GridPosition>;
}

type PlaceBuildingPayload = {
  position: GridPosition;
  type: BuildingType;
};

type PlacementFailedPayload = PlaceBuildingPayload & {
  reason: string;
};

type BuildingPlacedPayload = PlaceBuildingPayload & {
  newState: GameState;
};

export type GameEvents = {
  'game:request_place_building': PlaceBuildingPayload;
  'game:placement_failed': PlacementFailedPayload;
  'state:building_placed': BuildingPlacedPayload;
};