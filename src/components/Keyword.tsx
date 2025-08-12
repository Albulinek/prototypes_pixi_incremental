import React, { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { helpArticles } from '@/data/helpContent';
import { X } from 'lucide-react';

// A dedicated parser component to handle recursive keyword rendering.
const ContentParser: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\[keyword:[a-zA-Z0-9|]+\])/);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/\[keyword:([a-zA-Z0-9]+)(?:\|([a-zA-Z0-9\s]+))?\]/);
        if (match) {
          const keyword = match[1];
          const displayText = match[2] || keyword;
          return <Keyword key={index} keyword={keyword} displayText={displayText} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};


const LOCK_DELAY = 1000; // 1 second to lock

export const Keyword: React.FC<{ keyword: string; displayText: string }> = ({ keyword, displayText }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const article = helpArticles[keyword.toLowerCase()];

  const handleOpenChange = (open: boolean) => {
    if (isLocked) return;
    setIsOpen(open);

    if (open) {
      // Start timer to lock
      timerRef.current = setTimeout(() => {
        setIsLocked(true);
        setProgress(100);
        if(progressRef.current) clearInterval(progressRef.current);
      }, LOCK_DELAY);
      // Start progress bar animation
      let startTime = Date.now();
      progressRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const percent = Math.min((elapsedTime / LOCK_DELAY) * 100, 100);
        setProgress(percent);
        if(percent >= 100) {
            clearInterval(progressRef.current!);
        }
      }, 50);

    } else {
      // Clear timers if mouse leaves before lock
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(0);
    }
  };

  const forceClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLocked(false);
    setIsOpen(false);
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  if (!article) {
    return <span className="text-red-500 font-bold">{displayText}</span>;
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <span className="text-blue-400 font-bold cursor-pointer hover:underline">
          {displayText}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top" align="center">
        <div className="relative pb-2">
            {isLocked && (
                 <button onClick={forceClose} className="absolute -top-2 -right-2 p-1 rounded-full bg-secondary hover:bg-muted">
                    <X size={16} />
                 </button>
            )}
            <h4 className="font-bold text-md mb-2">{article.title}</h4>
            <div className="text-sm text-muted-foreground leading-relaxed">
                <ContentParser text={article.content} />
            </div>
            {!isLocked && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}></div>
                </div>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
