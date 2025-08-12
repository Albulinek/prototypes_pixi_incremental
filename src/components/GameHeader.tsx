import { useGameStore, CYCLE_DURATION } from '../store/useGameStore';
import { Sun, Moon } from 'lucide-react';

export function GameHeader() {
  const time = useGameStore((state) => state.time);
  const progress = (time / CYCLE_DURATION) * 100;
  const isDay = time < CYCLE_DURATION / 2;

  return (
    <header className="h-16 bg-zinc-950 border-b-2 border-zinc-800 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold tracking-wider uppercase">Deep Dig</h1>
      <div className="flex items-center space-x-4">
        <div className="w-48 h-8 bg-gradient-to-r from-yellow-300 via-sky-500 to-indigo-800 rounded-full p-1">
          <div className="w-full h-full bg-zinc-900 rounded-full relative">
             <div 
               className="h-full w-1 bg-white absolute top-0"
               style={{ left: `${progress}%`}}
             ></div>
          </div>
        </div>
        {isDay ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-400" />}
      </div>
    </header>
  );
}
