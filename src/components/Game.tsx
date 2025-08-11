import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameCanvas } from './GameCanvas';
import { DebugPanel } from './DebugPanel';

const TICK_INTERVAL_MS = 1000; // 1 tick per second

export function Game() {
  const gameTick = useGameStore((state) => state.gameTick);

  useEffect(() => {
    // This sets up the main game loop
    const tickInterval = setInterval(() => {
      gameTick();
    }, TICK_INTERVAL_MS);

    return () => {
      clearInterval(tickInterval); // Cleanup on component unmount
    };
  }, [gameTick]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#111' }}>
      <GameCanvas />
      <DebugPanel />
    </div>
  );
}