import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameCanvas } from './GameCanvas';
import { BuildMenuPanel } from './BuildMenuPanel';
import { BottomDebugConsole } from './BottomDebugConsole';

const TICK_INTERVAL_MS = 1000;

export function Game() {
  const isDebug = useGameStore((state) => state.debug.enabled);
  const toggleDebug = useGameStore((state) => state.toggleDebug);

  useEffect(() => {
    const { gameTick } = useGameStore.getState();
    const tickInterval = setInterval(() => {
      gameTick();
    }, TICK_INTERVAL_MS);

    return () => clearInterval(tickInterval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#111' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <GameCanvas />
        {isDebug && <BuildMenuPanel />}
        <button onClick={toggleDebug} style={{ position: 'absolute', top: 10, right: 10 }}>
          Toggle Debug
        </button>
      </div>
      {isDebug && <BottomDebugConsole />}
    </div>
  );
}