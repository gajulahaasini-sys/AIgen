import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { GlitchText } from './GlitchText';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  // Use refs for state accessed inside the game loop to avoid stale closures
  // without triggering re-renders on every tick
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    directionRef.current = { x: 0, y: -1 };
    nextDirectionRef.current = { x: 0, y: -1 };
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setGameState(GameState.PLAYING);
  }, [generateFood]);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && (gameState === GameState.IDLE || gameState === GameState.GAME_OVER)) {
        resetGame();
        return;
      }

      if (e.key === 'Escape' && gameState === GameState.PLAYING) {
        setGameState(GameState.PAUSED);
        return;
      }
      if (e.key === 'Escape' && gameState === GameState.PAUSED) {
        setGameState(GameState.PLAYING);
        return;
      }

      if (gameState !== GameState.PLAYING) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, resetGame]);

  // Game Loop
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        directionRef.current = nextDirectionRef.current;
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameState(GameState.GAME_OVER);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameState(GameState.GAME_OVER);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
          setFood(generateFood(newSnake));
          // Don't pop the tail, so it grows
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [gameState, speed, food, generateFood]);

  // Render Grid
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        let cellClass = "w-full h-full border-[0.5px] border-cyan-900/20 ";
        
        if (isSnakeHead) {
          cellClass += "bg-cyan-400 shadow-[0_0_10px_#00ffff] z-10 relative";
        } else if (isSnakeBody) {
          cellClass += "bg-cyan-700/80";
        } else if (isFood) {
          cellClass += "bg-fuchsia-500 shadow-[0_0_15px_#ff00ff] animate-pulse";
        }

        cells.push(
          <div key={`${x}-${y}`} className={cellClass} />
        );
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Stats Header */}
      <div className="w-full flex justify-between items-end mb-4 border-b-2 border-cyan-500 pb-2 px-2">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-700">DATA_FRAGMENTS_RECOVERED</span>
          <GlitchText text={score.toString().padStart(4, '0')} className="text-3xl text-cyan-400" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-cyan-700">SYS_SPEED</span>
          <span className="text-xl text-fuchsia-500">{Math.floor((INITIAL_SPEED - speed) / SPEED_INCREMENT)}</span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full aspect-square bg-black border-4 border-cyan-800 shadow-[0_0_30px_rgba(0,255,255,0.15)] p-1">
        
        {/* The Grid */}
        <div 
          className="w-full h-full grid" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {renderGrid()}
        </div>

        {/* Overlays */}
        {gameState === GameState.IDLE && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <GlitchText text="NEURO_SNAKE" as="h1" className="text-4xl md:text-6xl mb-8 text-cyan-400" />
            <button 
              onClick={resetGame}
              className="px-6 py-2 border-2 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black transition-all uppercase tracking-widest font-bold animate-pulse"
            >
              INITIATE_SEQUENCE
            </button>
            <p className="mt-4 text-xs text-cyan-700">USE [W,A,S,D] OR ARROWS TO NAVIGATE</p>
          </div>
        )}

        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 bg-red-900/40 flex flex-col items-center justify-center z-20 backdrop-blur-md border-4 border-red-500">
            <GlitchText text="SYSTEM_FAILURE" as="h2" className="text-4xl md:text-5xl mb-2 text-red-500" />
            <p className="text-red-400 mb-8 tracking-widest">KERNEL_PANIC // DATA_LOST</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest font-bold"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}

        {gameState === GameState.PAUSED && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <GlitchText text="PROCESS_SUSPENDED" as="h2" className="text-3xl text-yellow-500 mb-4" />
            <p className="text-cyan-500 animate-pulse">PRESS [ESC] TO RESUME</p>
          </div>
        )}
      </div>
    </div>
  );
};
