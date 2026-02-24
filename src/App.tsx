import { useState } from 'react';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { Board } from './components/Board/Board';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { Settings, Calendar } from 'lucide-react';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState<'board' | 'settings'>('board');

  return (
    <div className="min-h-screen bg-[#141414] text-stone-200 font-sans flex flex-col">
      <header className="bg-stone-900 border-b border-stone-800 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            School Scheduler
          </h1>
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'board' ? 'bg-indigo-600/20 text-indigo-300' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
            >
              <Calendar className="w-4 h-4" /> 時間割ボード
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'settings' ? 'bg-indigo-600/20 text-indigo-300' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
            >
              <Settings className="w-4 h-4" /> 設定
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto relative">
        {activeTab === 'board' ? <Board /> : <SettingsPanel />}
      </main>
    </div>
  );
};

function App() {
  return (
    <ScheduleProvider>
      <MainLayout />
    </ScheduleProvider>
  );
}

export default App;
