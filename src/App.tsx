import { Game } from './components/Game';
import { useState, useEffect } from 'react';
import { Assets } from 'pixi.js';

// Define all the assets we need for the game
const assets = [
    { alias: 'minerSprite', src: '/miner_sprite.png' },
    { alias: 'minerNormal', src: '/miner_normal.png' },
];

let assetsInitialized = false;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAssets = async () => {
        if (assetsInitialized) {
            setIsLoading(false);
            return;
        }
        assetsInitialized = true;
        // Init PixiJS assets with a manifest
        await Assets.init({ manifest: { bundles: [{ name: 'game-assets', assets }] } });
        // Load the bundle
        await Assets.loadBundle('game-assets');
        // Loading is complete
        setIsLoading(false);
    };
    
    initAssets();
  }, []);

  if (isLoading) {
    // You can replace this with a more sophisticated loading screen
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-background">
            <p className="text-foreground text-xl">Loading Assets...</p>
        </div>
    );
  }

  return (
    <main className="dark">
      <Game />
    </main>
  );
}

export default App;
