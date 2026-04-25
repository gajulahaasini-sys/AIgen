import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchText } from './components/GlitchText';
import { Cpu, Activity } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-cyan-400 p-4 md:p-8 flex flex-col relative overflow-hidden selection:bg-fuchsia-500 selection:text-black">
      
      {/* Background decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10"></div>

      {/* Header */}
      <header className="w-full flex justify-between items-start mb-8 border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-3">
          <Cpu className="text-fuchsia-500 animate-pulse" size={32} />
          <div>
            <GlitchText text="TERMINAL_OS v9.9.1" className="text-xl md:text-2xl font-bold tracking-wider" />
            <div className="text-xs text-cyan-700 flex items-center gap-2 mt-1">
              <Activity size={12} />
              <span>SECURE_CONNECTION_ESTABLISHED</span>
            </div>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs text-fuchsia-700">USER: GUEST_ENTITY</div>
          <div className="text-xs text-cyan-700">SYS_TIME: {new Date().toLocaleTimeString()}</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col lg:flex-row gap-8 items-start justify-center max-w-7xl mx-auto w-full">
        
        {/* Left Column: Game */}
        <div className="w-full lg:w-2/3 flex-shrink-0">
          <SnakeGame />
        </div>

        {/* Right Column: Modules (Music Player) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Decorative Module Box */}
          <div className="border border-cyan-800 bg-black/50 p-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400"></div>
            
            <h3 className="text-sm text-cyan-600 mb-2 border-b border-cyan-900 pb-1">SYS_DIAGNOSTICS</h3>
            <ul className="text-xs text-cyan-800 space-y-1 font-mono">
              <li>CPU_LOAD: <span className="text-fuchsia-500">89%</span></li>
              <li>MEM_ALLOC: <span className="text-cyan-500">0x4F2A</span></li>
              <li>NET_LATENCY: <span className="text-cyan-500">12ms</span></li>
              <li className="animate-pulse text-yellow-500 mt-2">WARNING: ANOMALY DETECTED IN SECTOR 7G</li>
            </ul>
          </div>

          {/* Music Player Module */}
          <MusicPlayer />

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-cyan-900 border-t border-cyan-900/30 pt-4">
        <p>END OF LINE // UNAUTHORIZED ACCESS WILL BE TERMINATED</p>
      </footer>
    </div>
  );
};

export default App;
