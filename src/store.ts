// import { type GameState, BuildingType } from './types';

// export function getInitialState(): GameState {
//   const GRID_SIZE = 10;
//   const grid = Array.from({ length: GRID_SIZE }, (_, y) =>
//     Array.from({ length: GRID_SIZE }, (_, x) => ({
//       position: { x, y },
//     }))
//   );

//   return {
//     grid,
//     resources: {
//       stone: 0,
//       iron: 0,
//       gold: 0,
//     },
//     debug: {
//       enabled: false,
//     },
//   };
// }

// export const BUILDING_COSTS = {
//   [BuildingType.MINER]: { stone: 100 },
//   [BuildingType.BASE]: { stone: 0 },
//   [BuildingType.TUNNEL]: { stone: 10 },
//   [BuildingType.REFINERY]: { stone: 150 },
// } as const;