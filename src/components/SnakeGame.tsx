import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const NEON_COLORS = {
  head: 'bg-white shadow-[0_0_12px_#fff]',
  body: 'bg-[#22c55e] border border-black rounded-[2px] shadow-[0_0_8px_#22c55e]',
  food: 'bg-[#ff00ff] shadow-[0_0_12px_#ff00ff] rounded-full'
};

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Ref to track latest direction to prevent quick double-press reverse suicides
  const latestDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Ensure food doesn't spawn on snake
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    latestDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault(); // Prevent scrolling
      }

      if (isGameOver) {
        if (e.key === 'Enter') resetGame();
        return;
      }

      const currentDir = latestDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        latestDirectionRef.current = direction;

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check walls collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          // Don't pop the tail, so snake grows
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    // Increase speed slightly as score goes up
    const currentSpeed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(interval);
  }, [direction, isPaused, isGameOver, food, score, generateFood]);

  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
    }
  }, [isGameOver, score, highScore]);

  // Render grid cells
  const gridCells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHead = snake[0].x === x && snake[0].y === y;
      const isBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
      const isFoodCell = food.x === x && food.y === y;

      gridCells.push(
        <div
          key={`${x}-${y}`}
          className={`
            w-full h-full rounded-[2px] transition-all duration-75
            ${isHead ? NEON_COLORS.head + ' z-10 relative' : ''}
            ${isBody ? NEON_COLORS.body : ''}
            ${isFoodCell ? NEON_COLORS.food + ' scale-75 animate-pulse' : ''}
          `}
        />
      );
    }
  }

  return (
    <div className="w-full h-full flex flex-col relative items-center justify-center isolate px-4">
      {/* Score Header */}
      <div className="absolute top-[24px] left-[24px] right-[24px] flex justify-between items-start z-10 pointer-events-none md:max-w-3xl mx-auto">
        <div className="bg-black/40 border border-slate-800 py-3 px-5 rounded-xl backdrop-blur-sm pointer-events-auto">
          <div className="text-[10px] uppercase text-slate-400 mb-1">Current Score</div>
          <div className="text-2xl font-extrabold font-mono text-[#00f3ff] leading-none">{String(score).padStart(5, '0')}</div>
        </div>
        <div className="bg-black/40 border border-slate-800 py-3 px-5 rounded-xl backdrop-blur-sm pointer-events-auto text-right">
          <div className="text-[10px] uppercase text-slate-400 mb-1 w-full flex justify-end">High Score</div>
          <div className="text-2xl font-extrabold font-mono text-slate-200 leading-none">{String(highScore).padStart(5, '0')}</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="w-[480px] h-[480px] max-w-full max-h-[80vh] aspect-square bg-black border-[4px] border-slate-800 relative shadow-[0_0_40px_rgba(0,0,0,0.5)] shrink-0">
        <div 
          className="grid w-full h-full" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {gridCells}
        </div>

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {isGameOver ? (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl font-black text-[#ff00ff] tracking-widest uppercase mb-2 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]">
                  System Failure
                </h2>
                <p className="text-slate-300 font-mono mb-8">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 border border-[#00f3ff] bg-[#00f3ff]/10 text-[#00f3ff] hover:bg-[#00f3ff]/20 rounded-lg font-bold tracking-widest transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" /> REBOOT
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#00f3ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)] bg-[#00f3ff]/10 text-[#00f3ff] animate-pulse">
                  <Play className="w-8 h-8 ml-1 fill-current" />
                </div>
                <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] mb-2">
                  Ready Player
                </h2>
                <p className="text-slate-400 text-sm mt-4">Press SPACE or Enter to Start</p>
                <p className="text-slate-500 text-xs mt-2">Use WASD or Arrow Keys</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-slate-400 text-sm z-10 font-medium">Use WASD or Arrow Keys to navigate</div>
    </div>
  );
}
