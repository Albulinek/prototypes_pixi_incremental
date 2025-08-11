import { test, expect, describe, beforeEach } from 'bun:test';
import fc from 'fast-check';
import { useGameStore, BUILDING_COSTS } from './useGameStore';
import { BuildingType } from '../types';

describe('useGameStore Actions', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  describe('Example-Based Tests', () => {
    test('placeBuilding should add a building and deduct resources on success', () => {
      const position = { x: 5, y: 5 };
      const success = useGameStore.getState().placeBuilding(position, BuildingType.MINER);

      const state = useGameStore.getState();
      expect(success).toBe(true);
      expect(state.grid[5][5].building?.type).toBe(BuildingType.MINER);
      expect(state.resources.stone).toBe(400);
    });

    test('placeBuilding should fail if resources are insufficient', () => {
      useGameStore.getState().addStone(-451);
      const position = { x: 5, y: 5 };
      const success = useGameStore.getState().placeBuilding(position, BuildingType.MINER);

      const state = useGameStore.getState();
      expect(success).toBe(false);
      expect(state.grid[5][5].building).toBeUndefined();
      expect(state.resources.stone).toBe(49);
    });

    test('placeBuilding should fail if the cell is already occupied', () => {
      const position = { x: 10, y: 10 };
      useGameStore.getState().placeBuilding(position, BuildingType.BASE);
      const success = useGameStore.getState().placeBuilding(position, BuildingType.MINER);

      const state = useGameStore.getState();
      expect(success).toBe(false);
      expect(state.grid[10][10].building?.type).toBe(BuildingType.BASE);
    });
  });

  describe('Property-Based Tests', () => {
    test('state should not change if placement is invalid', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.constantFrom(...Object.values(BuildingType)),
          fc.record({ x: fc.integer({ min: 0, max: 19 }), y: fc.integer({ min: 0, max: 19 }) }),
          (initialStone, buildingType, position) => {
            fc.pre(BUILDING_COSTS[buildingType].stone > initialStone);

            useGameStore.getState().reset();
            useGameStore.getState().addStone(initialStone - 500);
            
            const stateBeforeAction = JSON.stringify(useGameStore.getState());
            
            const success = useGameStore.getState().placeBuilding(position, buildingType);
            
            const stateAfterAction = JSON.stringify(useGameStore.getState());

            expect(success).toBe(false);
            expect(stateAfterAction).toEqual(stateBeforeAction);
          }
        )
      );
    });
  });
});