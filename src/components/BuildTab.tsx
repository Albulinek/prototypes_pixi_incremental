import { useGameStore } from '../store/useGameStore';
import { BuildingType } from '../types';
import { Button } from './ui/button';

export function BuildTab() {
  const { selectedBuildingType, setSelectedBuildingType } = useGameStore();

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-lg font-semibold tracking-tight">Construction</h3>
      <p className="text-sm text-muted-foreground pb-2">
        Select a building to place on the grid.
      </p>
      <Button
        variant={selectedBuildingType === BuildingType.MINER ? 'secondary' : 'outline'}
        onClick={() => setSelectedBuildingType(BuildingType.MINER)}
      >
        Miner
      </Button>
      <Button
        variant={selectedBuildingType === BuildingType.TUNNEL ? 'secondary' : 'outline'}
        onClick={() => setSelectedBuildingType(BuildingType.TUNNEL)}
      >
        Tunnel
      </Button>
    </div>
  );
}
