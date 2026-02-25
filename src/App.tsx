import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Trophy, 
  Settings, 
  Calendar, 
  BarChart2, 
  Layers, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  Zap
} from 'lucide-react';
import { BRANCHES, QUOTES, FLASHCARDS } from './constants';
import { Subject, Task, Flashcard } from './types';

export default function App() {
  // State
  const [branch, setBranch] = useState(BRANCHES.math);
  const [subjects, setSubjects] = useState<Subject[]>(BRANCHES.math.subjects);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [activeTab, setActiveTab] = useState<'plan' | 'stats' | 'cards'>('plan');
  const [quote, setQuote] = useState(QUOTES[0]);
  
  // Pomodoro State
  const [pomTime, setPomTime] = useState(25 * 60);
  const [pomActive, setPomActive] = useState(false);
  const [pomMode, setPomMode] = useState<'focus' | 'break'>('focus');

  // Flashcards State
  const [fcSubject, setFcSubject] = useState('');
  const [fcIndex, setFcIndex] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('bacflix_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTasks(parsed.tasks || {});
      setXp(parsed.xp || 0);
      setLevel(parsed.level || 1);
      setStreak(parsed.streak || 0);
    }
    
    const interval = setInterval(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('bacflix_data', JSON.stringify({ tasks, xp, level, streak }));
  }, [tasks, xp, level, streak]);

  // Pomodoro Logic
  useEffect(() => {
    let timer: any;
    if (pomActive && pomTime > 0) {
      timer = setInterval(() => setPomTime(t => t - 1), 1000);
    } else if (pomTime === 0) {
      setPomActive(false);
      const nextMode = pomMode === 'focus' ? 'break' : 'focus';
      setPomMode(nextMode);
      setPomTime(nextMode === 'focus' ? 25 * 60 : 5 * 60);
      if (pomMode === 'focus') setXp(prev => prev + 50);
    }
    return () => clearInterval(timer);
  }, [pomActive, pomTime, pomMode]);

  // Helpers
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  
  const generatePlan = () => {
    const newTasks: Record<string, Task> = {};
    const days = 6; // Sat to Thu
    const slots = 4;
    
    // Simple logic: prioritize low level subjects
    const pool = [...subjects].sort((a, b) => {
      const rank = { low: 3, med: 2, high: 1 };
      return rank[b.lvl] - rank[a.lvl] || b.coeff - a.coeff;
    });

    for (let d = 0; d < days; d++) {
      for (let s = 0; s < slots; s++) {
        const subj = pool[(d * slots + s) % pool.length];
        const id = `task_${d}_${s}`;
        newTasks[id] = {
          id,
          subj: subj.name,
          done: false,
          conf: 0,
          time: ['08:30', '10:30', '14:00', '16:30'][s],
          day: d,
          slot: s
        };
      }
    }
    setTasks(newTasks);
    setXp(prev => prev + 20);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => {
      const task = prev[id];
      if (!task) return prev;
      const isDone = !task.done;
      if (isDone) setXp(x => x + 15);
      return { ...prev, [id]: { ...task, done: isDone } };
    });
  };

  const setConf = (id: string, val: number) => {
    setTasks(prev => ({ ...prev, [id]: { ...prev[id], conf: val } }));
  };

  const progress = useMemo(() => {
    const total = Object.keys(tasks).length;
    if (total === 0) return 0;
    const done = Object.values(tasks).filter((t: Task) => t.done).length;
    return Math.round((done / total) * 100);
  }, [tasks]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 border-b-2 border-red-600 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-red-600 tracking-tighter">BAC<span className="text-white">FLIX</span></h1>
          <div className="hidden md:block text-xs text-zinc-500 font-bold uppercase tracking-widest">Planner Pro 2.0</div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-orange-500/30">
            <Flame size={18} className="text-orange-500" />
            <span className="text-sm font-bold text-orange-500">{streak} يوم</span>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="text-[10px] text-zinc-500 font-bold uppercase">Level {level} — {xp} XP</div>
            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-red-600" 
                initial={{ width: 0 }}
                animate={{ width: `${(xp % 100)}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Quote Bar */}
      <div className="bg-gradient-to-r from-red-950/20 via-black to-red-950/20 py-2 text-center border-b border-zinc-800">
        <p className="text-sm italic text-zinc-400">"{quote}"</p>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider">
              <Settings size={16} /> إعدادات الخطة
            </div>
            
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 transition-colors"
              value={branch.id}
              onChange={(e) => {
                const b = BRANCHES[e.target.value];
                setBranch(b);
                setSubjects(b.subjects);
              }}
            >
              {Object.values(BRANCHES).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>

            <div className="space-y-3">
              <div className="text-[10px] text-zinc-500 font-bold uppercase">مستواك في المواد</div>
              <div className="max-height-[300px] overflow-y-auto space-y-2 pr-1">
                {subjects.map((s, i) => (
                  <div key={s.name} className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold">{s.name}</div>
                      <div className="text-[10px] text-zinc-500">معامل {s.coeff}</div>
                    </div>
                    <select 
                      className="bg-zinc-800 text-[10px] rounded px-2 py-1 outline-none"
                      value={s.lvl}
                      onChange={(e) => {
                        const newSubjs = [...subjects];
                        newSubjs[i].lvl = e.target.value as any;
                        setSubjects(newSubjs);
                      }}
                    >
                      <option value="high">جيد</option>
                      <option value="med">متوسط</option>
                      <option value="low">ضعيف</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={generatePlan}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap size={18} /> توليد الخطة الذكية
            </button>
          </section>

          <section className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-red-600 font-bold text-sm uppercase tracking-wider">التقدم الأسبوعي</div>
              <div className="text-2xl font-black text-white">{progress}%</div>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-700 to-red-500" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </section>
        </aside>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 w-fit">
            {[
              { id: 'plan', label: 'الخطة', icon: Calendar },
              { id: 'stats', label: 'التحليلات', icon: BarChart2 },
              { id: 'cards', label: 'البطاقات', icon: Layers },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'plan' && (
              <motion.div 
                key="plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {Object.keys(tasks).length === 0 ? (
                  <div className="col-span-full py-20 text-center space-y-4 opacity-30">
                    <Calendar size={64} className="mx-auto" />
                    <p className="text-xl font-bold">لم يتم توليد أي خطة بعد</p>
                  </div>
                ) : (
                  [0,1,2,3,4,5].map(dayIdx => (
                    <div key={dayIdx} className="glass-card rounded-2xl overflow-hidden border-zinc-800">
                      <div className="bg-zinc-900 px-5 py-3 border-b border-zinc-800 flex justify-between items-center">
                        <span className="font-bold text-sm">
                          {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'][dayIdx]}
                        </span>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Day {dayIdx + 1}</div>
                      </div>
                      <div className="p-2 space-y-1">
                        {[0,1,2,3].map(slotIdx => {
                          const task = tasks[`task_${dayIdx}_${slotIdx}`];
                          if (!task) return null;
                          return (
                            <div 
                              key={task.id} 
                              className={`p-4 rounded-xl border transition-all ${
                                task.done ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50' : 'bg-zinc-900 border-zinc-800 hover:border-red-600/50'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold">
                                  <Clock size={12} /> {task.time}
                                </div>
                                <button onClick={() => toggleTask(task.id)}>
                                  <CheckCircle2 size={20} className={task.done ? 'text-green-500' : 'text-zinc-700 hover:text-red-600'} />
                                </button>
                              </div>
                              <div className="font-bold text-lg mb-3">{task.subj}</div>
                              <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(s => (
                                  <Star 
                                    key={s} 
                                    size={14} 
                                    className={`cursor-pointer transition-colors ${s <= task.conf ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-800'}`}
                                    onClick={() => setConf(task.id, s)}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'cards' && (
              <motion.div 
                key="cards"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div className="flex gap-4">
                  <select 
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none"
                    value={fcSubject}
                    onChange={(e) => {
                      setFcSubject(e.target.value);
                      setFcIndex(0);
                      setFcFlipped(false);
                    }}
                  >
                    <option value="">اختر مادة للمراجعة...</option>
                    {Object.keys(FLASHCARDS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {fcSubject && FLASHCARDS[fcSubject] ? (
                  <div className="space-y-8">
                    <div 
                      className="h-80 perspective-1000 cursor-pointer group"
                      onClick={() => setFcFlipped(!fcFlipped)}
                    >
                      <motion.div 
                        className="relative w-full h-full transition-all duration-500 preserve-3d"
                        animate={{ rotateY: fcFlipped ? 180 : 0 }}
                      >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border-2 border-zinc-800 group-hover:border-red-600/30">
                          <div className="text-xs text-red-600 font-bold uppercase tracking-widest mb-4">السؤال</div>
                          <div className="text-2xl font-bold leading-relaxed">{FLASHCARDS[fcSubject][fcIndex].q}</div>
                          <div className="mt-8 text-zinc-600 text-xs font-bold">انقر للقلب</div>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border-2 border-red-600/50 rotate-y-180 bg-red-950/10">
                          <div className="text-xs text-green-500 font-bold uppercase tracking-widest mb-4">الإجابة</div>
                          <div className="text-xl font-bold leading-relaxed text-zinc-200">{FLASHCARDS[fcSubject][fcIndex].a}</div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="flex justify-center items-center gap-8">
                      <button 
                        onClick={() => { setFcIndex(i => Math.max(0, i - 1)); setFcFlipped(false); }}
                        className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className="text-sm font-bold text-zinc-500">{fcIndex + 1} / {FLASHCARDS[fcSubject].length}</div>
                      <button 
                        onClick={() => { setFcIndex(i => Math.min(FLASHCARDS[fcSubject].length - 1, i + 1)); setFcFlipped(false); }}
                        className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center opacity-30 space-y-4">
                    <Layers size={64} className="mx-auto" />
                    <p className="text-xl font-bold">اختر مادة لبدء التحدي</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Pomodoro FAB */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <motion.div 
          className={`glass-card rounded-3xl p-6 mb-4 border-red-600/50 shadow-2xl shadow-red-900/20 w-64 ${pomActive ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center space-y-4">
            <div className="text-[10px] text-red-600 font-black uppercase tracking-widest">
              {pomMode === 'focus' ? 'وقت التركيز' : 'وقت الراحة'}
            </div>
            <div className="text-4xl font-black font-mono tracking-tighter">{formatTime(pomTime)}</div>
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => setPomActive(!pomActive)}
                className="bg-red-600 p-2 rounded-xl hover:bg-red-700 transition-colors"
              >
                {pomActive ? <RotateCcw size={20} /> : <Play size={20} />}
              </button>
              <button 
                onClick={() => { setPomActive(false); setPomTime(25 * 60); }}
                className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </motion.div>
        
        <button 
          onClick={() => setPomActive(!pomActive)}
          className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-900/40 hover:scale-110 transition-transform active:scale-95"
        >
          <Clock size={28} className="text-white" />
        </button>
      </div>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-zinc-800 px-6 py-3 flex justify-around md:hidden backdrop-blur-md">
        <button onClick={() => setActiveTab('plan')} className={`p-2 ${activeTab === 'plan' ? 'text-red-600' : 'text-zinc-500'}`}><Calendar /></button>
        <button onClick={() => setActiveTab('stats')} className={`p-2 ${activeTab === 'stats' ? 'text-red-600' : 'text-zinc-500'}`}><BarChart2 /></button>
        <button onClick={() => setActiveTab('cards')} className={`p-2 ${activeTab === 'cards' ? 'text-red-600' : 'text-zinc-500'}`}><Layers /></button>
      </nav>
    </div>
  );
}
