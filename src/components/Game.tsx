import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameCanvas } from './GameCanvas';
import { UiPanel } from './UiPanel';
import { BottomDebugConsole } from './BottomDebugConsole';
import { Button } from './ui/button';
import { useShallow } from 'zustand/react/shallow';
import { GameHeader } from './GameHeader';

const TICK_INTERVAL_MS = 1000;

const DebugToggle = () => {
  const { isDebug, toggleDebug } = useGameStore(
    useShallow((state) => ({
      isDebug: state.debug.enabled,
      toggleDebug: state.toggleDebug,
    }))
  );

  return (
    <Button
      onClick={toggleDebug}
      variant="outline"
      size="sm"
      className="absolute bottom-4 right-4 z-50"
    >
      Debug: {isDebug ? 'On' : 'Off'}
    </Button>
  );
};

export function Game() {
  const isDebug = useGameStore((state) => state.debug.enabled);

  useEffect(() => {
    const { gameTick } = useGameStore.getState();
    const tickInterval = setInterval(() => {
      gameTick();
    }, TICK_INTERVAL_MS);

    return () => clearInterval(tickInterval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <GameHeader />
      <div className="flex-grow grid grid-cols-3 overflow-hidden">
        <div className="col-span-2 flex justify-center items-center bg-zinc-900 relative">
          <GameCanvas />
          <DebugToggle />
        </div>
        <div className="col-span-1 bg-zinc-950 border-l border-zinc-800 p-4 overflow-y-auto">
          <UiPanel />
        </div>
      </div>
      {isDebug && <BottomDebugConsole />}
    </div>
  );
}
