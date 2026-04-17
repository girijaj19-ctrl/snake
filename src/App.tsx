import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="h-screen w-full bg-slate-950 text-slate-50 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-[60px] border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-[10px] shrink-0">
        <div className="font-extrabold text-xl tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-[#00f3ff] to-[#ff00ff] rounded" />
          NEON SYNTH SNAKE
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Ready to play</span>
          <div className="w-8 h-8 rounded-full bg-slate-700" />
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-slate-900 border-r border-slate-800 p-6 flex-col gap-5 overflow-y-auto hidden md:flex">
          <div>
            <h3 className="text-[12px] uppercase text-slate-400 tracking-[0.1em] mb-3 font-semibold">Music Library</h3>
            <div className="p-3 rounded-lg bg-[#00f3ff]/5 border border-[#00f3ff] cursor-pointer flex items-center gap-3 mb-2 transition-colors">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%2300f3ff'/%3E%3C/svg%3E" alt="Art" className="w-10 h-10 rounded bg-slate-800 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-[#00f3ff]">Cyber Pulse</div>
                <div className="text-xs text-slate-400 truncate">AI Generation • 03:42</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-transparent hover:bg-white/10 cursor-pointer flex items-center gap-3 mb-2 transition-colors">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23ff00ff'/%3E%3C/svg%3E" alt="Art" className="w-10 h-10 rounded bg-slate-800 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-slate-50">Neon Nights</div>
                <div className="text-xs text-slate-400 truncate">AI Generation • 04:15</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-transparent hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%2322c55e'/%3E%3C/svg%3E" alt="Art" className="w-10 h-10 rounded bg-slate-800 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-slate-50">Data Stream</div>
                <div className="text-xs text-slate-400 truncate">AI Generation • 02:58</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Game Viewport */}
        <section 
          className="relative flex flex-col items-center justify-center overflow-hidden" 
          style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)' }}
        >
          <SnakeGame />
        </section>
      </main>

      {/* Footer */}
      <footer className="h-[100px] shrink-0 bg-slate-900 border-t border-slate-800 w-full relative z-20">
        <MusicPlayer />
      </footer>
    </div>
  );
}
