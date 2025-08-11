import { useGameStore } from '../store/useGameStore';
import { BuildingType } from '../types';

export function BuildMenuPanel() {
  const { selectedBuildingType, setSelectedBuildingType } = useGameStore();

  const getButtonStyle = (type: BuildingType) => ({
    background: selectedBuildingType === type ? '#6a9eff' : '#555',
    color: 'white',
    border: '1px solid #777',
    margin: '2px',
    padding: '5px',
    cursor: 'pointer',
  });

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', borderRadius: '5px', fontFamily: 'sans-serif' }}>
      <div>Build Menu</div>
      <button style={getButtonStyle(BuildingType.MINER)} onClick={() => setSelectedBuildingType(BuildingType.MINER)}>Miner</button>
      <button style={getButtonStyle(BuildingType.TUNNEL)} onClick={() => setSelectedBuildingType(BuildingType.TUNNEL)}>Tunnel</button>
    </div>
  );
}