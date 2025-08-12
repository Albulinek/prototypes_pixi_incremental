import { useGameStore } from '../store/useGameStore';
import { Button } from './ui/button';
import { useShallow } from 'zustand/react/shallow';

export function BottomDebugConsole() {
  const { log, addStone, resources } = useGameStore(
    useShallow((state) => ({
      log: state.log,
      addStone: state.addStone,
      resources: state.resources,
    }))
  );

  return (
    <div className="h-48 bg-zinc-950 border-t-2 border-zinc-800 flex text-sm">
      <div className="flex-1 p-2">
        <h4 className="font-bold mb-2 pb-1 border-b border-zinc-700">Actions</h4>
        <div>Current Stone: {resources.stone}</div>
        <Button onClick={() => addStone(100)} size="sm" variant="secondary" className="mt-2">
          +100 Stone
        </Button>
      </div>
      <div className="flex-initial w-px bg-zinc-800"></div>
      <div className="flex-[3] p-2 flex flex-col">
        <h4 className="font-bold mb-2 pb-1 border-b border-zinc-700">Log</h4>
        <div className="flex-grow overflow-y-auto bg-zinc-900 p-2 rounded-sm font-mono text-xs">
          {log.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
