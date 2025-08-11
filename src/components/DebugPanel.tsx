import { useGameStore } from '../store/useGameStore';

export function DebugPanel() {
  const stone = useGameStore((state) => state.resources.stone);
  const isDebug = useGameStore((state) => state.debug.enabled);
  const addStone = useGameStore((state) => state.addStone);
  const toggleDebug = useGameStore((state) => state.toggleDebug);

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', borderRadius: '5px', fontFamily: 'sans-serif' }}>
      <h3>Debug Panel</h3>
      <p>Stone: {stone}</p>
      <button onClick={() => addStone(100)}>+100 Stone</button>
      <button onClick={toggleDebug}>
        Toggle Debug ({isDebug ? 'On' : 'Off'})
      </button>
    </div>
  );
}