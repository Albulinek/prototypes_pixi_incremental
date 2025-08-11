import { useGameStore } from '../store/useGameStore';

export function BottomDebugConsole() {
  const log = useGameStore((state) => state.log);
  const addStone = useGameStore((state) => state.addStone);
  const resources = useGameStore((state) => state.resources);

  return (
    <div style={{ height: '200px', background: '#222', color: '#ccc', display: 'flex', fontFamily: 'sans-serif', borderTop: '2px solid #444' }}>
      <div style={{ flex: 1, padding: '10px' }}>
        <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #444', paddingBottom: '5px' }}>Actions</h4>
        <div>Current Stone: {resources.stone}</div>
        <button onClick={() => addStone(100)}>+100 Stone</button>
      </div>
      <div style={{ flex: 3, padding: '10px', borderLeft: '1px solid #444' }}>
        <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #444', paddingBottom: '5px' }}>Log</h4>
        <div style={{ height: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', background: '#111', padding: '5px', fontFamily: 'monospace', fontSize: '12px' }}>
          {log.map((msg, i) => <div key={i}>{msg}</div>)}
        </div>
      </div>
    </div>
  );
}